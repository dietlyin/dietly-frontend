/**
 * Dietly AWS Deployment Script (AWS SDK v3)
 *
 * Run from project root:
 *   node deploy-aws.js
 *
 * Prerequisites:
 *   1. AWS credentials configured (CloudShell auto-provides these, or set
 *      AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_SESSION_TOKEN locally)
 *   2. npm install (to get @aws-sdk packages)
 *   3. Set MONGODB_URI and JWT_SECRET below (or via env vars)
 *
 * What this script does:
 *   Phase 1 – Lightsail: create instance, allocate + attach static IP, open ports
 *   Phase 2 – S3: create bucket, enable website hosting, set public-read policy
 *   Phase 3 – Frontend: build with correct API URL, upload to S3
 *   After: prints next manual steps (SSH + MongoDB Atlas IP allowlist)
 */

const {
  LightsailClient,
  CreateInstancesCommand,
  AllocateStaticIpCommand,
  AttachStaticIpCommand,
  OpenInstancePublicPortsCommand,
  GetInstanceCommand,
  GetStaticIpCommand,
} = require("@aws-sdk/client-lightsail");

const {
  S3Client,
  CreateBucketCommand,
  PutBucketWebsiteCommand,
  PutBucketPolicyCommand,
  DeletePublicAccessBlockCommand,
  PutObjectCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");

const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ──────────────────────────────────────────────
// CONFIG — edit these if needed
// ──────────────────────────────────────────────
const REGION = "ap-south-1";
const AZ = "ap-south-1a";
const INSTANCE_NAME = "dietly-backend";
const BUNDLE_ID = "micro_3_1";
const BLUEPRINT_ID = "nodejs";
const STATIC_IP_NAME = "dietly-backend-ip";

// Backend env vars for the Lightsail instance (written to a shell script)
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "REPLACE_WITH_YOUR_MONGODB_URI";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "REPLACE_WITH_YOUR_JWT_SECRET";

// ──────────────────────────────────────────────
// Clients
// ──────────────────────────────────────────────
const lightsail = new LightsailClient({ region: REGION });
const sts = new STSClient({ region: REGION });

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function log(msg) {
  console.log(`\n[${new Date().toISOString()}] ${msg}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Poll until Lightsail instance reaches 'running' state (max 10 min) */
async function waitForInstance(name, timeoutMs = 600_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { instance } = await lightsail.send(
      new GetInstanceCommand({ instanceName: name })
    );
    const state = instance?.state?.name;
    log(`Instance state: ${state}`);
    if (state === "running") return instance;
    if (state === "error") throw new Error("Instance entered error state");
    await sleep(15_000);
  }
  throw new Error("Timed out waiting for instance to be running");
}

/** Recursively list all files in a directory */
function listFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(full, base) : [full];
  });
}

/** Guess Content-Type from extension */
function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".txt": "text/plain",
    ".xml": "application/xml",
  };
  return map[ext] || "application/octet-stream";
}

// ──────────────────────────────────────────────
// Phase 1 – Lightsail
// ──────────────────────────────────────────────
async function deployLightsail() {
  log("=== PHASE 1: Lightsail Instance ===");

  // 1a. Create instance
  log(`Creating instance '${INSTANCE_NAME}' (${BUNDLE_ID})...`);
  try {
    await lightsail.send(
      new CreateInstancesCommand({
        instanceNames: [INSTANCE_NAME],
        availabilityZone: AZ,
        blueprintId: BLUEPRINT_ID,
        bundleId: BUNDLE_ID,
        ipAddressType: "ipv4",
      })
    );
    log("Create-instances command sent.");
  } catch (err) {
    if (err.name === "InvalidInputException" && err.message.includes("already")) {
      log("Instance already exists — skipping create.");
    } else {
      throw err;
    }
  }

  // 1b. Wait for running
  log("Waiting for instance to become running (this takes 2–5 min)...");
  const instance = await waitForInstance(INSTANCE_NAME);
  const publicIp = instance.publicIpAddress;
  log(`Instance running. Temporary public IP: ${publicIp}`);

  // 1c. Allocate static IP
  log(`Allocating static IP '${STATIC_IP_NAME}'...`);
  try {
    await lightsail.send(
      new AllocateStaticIpCommand({ staticIpName: STATIC_IP_NAME })
    );
  } catch (err) {
    if (err.name === "InvalidInputException" && err.message.includes("already")) {
      log("Static IP already allocated — skipping.");
    } else {
      throw err;
    }
  }

  // 1d. Attach static IP
  log("Attaching static IP to instance...");
  try {
    await lightsail.send(
      new AttachStaticIpCommand({
        staticIpName: STATIC_IP_NAME,
        instanceName: INSTANCE_NAME,
      })
    );
  } catch (err) {
    if (err.message?.includes("already attached")) {
      log("Static IP already attached — skipping.");
    } else {
      throw err;
    }
  }

  // 1e. Get assigned static IP
  const { staticIp } = await lightsail.send(
    new GetStaticIpCommand({ staticIpName: STATIC_IP_NAME })
  );
  const backendIp = staticIp.ipAddress;
  log(`Static IP assigned: ${backendIp}`);

  // 1f. Open ports 22, 80, 443, 5000
  const ports = [
    { fromPort: 22, toPort: 22, protocol: "tcp" },
    { fromPort: 80, toPort: 80, protocol: "tcp" },
    { fromPort: 443, toPort: 443, protocol: "tcp" },
    { fromPort: 5000, toPort: 5000, protocol: "tcp" },
  ];
  for (const portInfo of ports) {
    log(`Opening port ${portInfo.fromPort}...`);
    try {
      await lightsail.send(
        new OpenInstancePublicPortsCommand({
          instanceName: INSTANCE_NAME,
          portInfo,
        })
      );
    } catch (err) {
      log(`Port ${portInfo.fromPort} already open or error: ${err.message}`);
    }
  }

  log(`\n✅ Lightsail ready. Backend IP: ${backendIp}`);
  return backendIp;
}

// ──────────────────────────────────────────────
// Phase 2 – S3 bucket
// ──────────────────────────────────────────────
async function deployS3Bucket(accountId) {
  const BUCKET_NAME = `dietly-frontend-${accountId}`;
  const s3 = new S3Client({ region: REGION });

  log("=== PHASE 2: S3 Bucket ===");

  // 2a. Create bucket
  log(`Creating bucket '${BUCKET_NAME}'...`);
  try {
    const createParams = { Bucket: BUCKET_NAME };
    // ap-south-1 requires LocationConstraint
    if (REGION !== "us-east-1") {
      createParams.CreateBucketConfiguration = {
        LocationConstraint: REGION,
      };
    }
    await s3.send(new CreateBucketCommand(createParams));
    log("Bucket created.");
  } catch (err) {
    if (
      err.name === "BucketAlreadyOwnedByYou" ||
      err.name === "BucketAlreadyExists"
    ) {
      log("Bucket already exists — skipping create.");
    } else {
      throw err;
    }
  }

  // 2b. Disable block public access
  log("Disabling block public access...");
  await s3.send(
    new DeletePublicAccessBlockCommand({ Bucket: BUCKET_NAME })
  );

  // 2c. Set public-read bucket policy
  log("Setting public-read bucket policy...");
  const policy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
      },
    ],
  });
  await s3.send(
    new PutBucketPolicyCommand({ Bucket: BUCKET_NAME, Policy: policy })
  );

  // 2d. Enable static website hosting
  log("Enabling static website hosting...");
  await s3.send(
    new PutBucketWebsiteCommand({
      Bucket: BUCKET_NAME,
      WebsiteConfiguration: {
        IndexDocument: { Suffix: "index.html" },
        ErrorDocument: { Key: "index.html" }, // SPA fallback
      },
    })
  );

  const websiteUrl = `http://${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com`;
  log(`✅ S3 bucket ready. Website URL: ${websiteUrl}`);
  return { bucketName: BUCKET_NAME, websiteUrl, s3 };
}

// ──────────────────────────────────────────────
// Phase 3 – Build & upload frontend
// ──────────────────────────────────────────────
async function deployFrontend(backendIp, bucketName, s3) {
  log("=== PHASE 3: Frontend Build & Upload ===");

  const frontendDir = path.join(__dirname, "frontend");
  const distDir = path.join(frontendDir, "dist");

  // 3a. Write .env.production with Lightsail IP
  const envContent = [
    `VITE_API_URL=http://${backendIp}:5000/api`,
    `VITE_WHATSAPP_NUMBER=919011154118`,
  ].join("\n");

  fs.writeFileSync(path.join(frontendDir, ".env.production"), envContent);
  log(`.env.production written with API URL: http://${backendIp}:5000/api`);

  // 3b. npm install + build
  log("Installing frontend dependencies...");
  execSync("npm install", { cwd: frontendDir, stdio: "inherit" });

  log("Building frontend...");
  execSync("npm run build", { cwd: frontendDir, stdio: "inherit" });

  // 3c. Upload dist/ to S3
  log(`Uploading ${distDir} to s3://${bucketName}...`);
  const files = listFiles(distDir);
  let uploaded = 0;

  for (const file of files) {
    const key = path.relative(distDir, file).replace(/\\/g, "/");
    const body = fs.readFileSync(file);
    const type = contentType(file);

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: type,
        // Cache bust index.html, cache assets long-term
        CacheControl: key === "index.html"
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=31536000, immutable",
      })
    );
    uploaded++;
    if (uploaded % 10 === 0) log(`  Uploaded ${uploaded}/${files.length} files...`);
  }

  log(`✅ Frontend uploaded (${files.length} files).`);
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  if (
    MONGODB_URI === "REPLACE_WITH_YOUR_MONGODB_URI" ||
    JWT_SECRET === "REPLACE_WITH_YOUR_JWT_SECRET"
  ) {
    console.error(
      "\n❌ Set MONGODB_URI and JWT_SECRET env vars before running:\n" +
        "   set MONGODB_URI=your_uri\n" +
        "   set JWT_SECRET=your_secret\n" +
        "   node deploy-aws.js\n"
    );
    process.exit(1);
  }

  try {
    // Get AWS account ID
    log("Verifying AWS credentials...");
    const { Account } = await sts.send(new GetCallerIdentityCommand({}));
    log(`AWS Account ID: ${Account}`);

    // Phase 1 – Lightsail
    const backendIp = await deployLightsail();

    // Phase 2 – S3
    const { bucketName, websiteUrl, s3 } = await deployS3Bucket(Account);

    // Phase 3 – Frontend
    await deployFrontend(backendIp, bucketName, s3);

    // ── Summary ──────────────────────────────────
    console.log(`
╔══════════════════════════════════════════════════════╗
║              DEPLOYMENT COMPLETE                    ║
╠══════════════════════════════════════════════════════╣
║  Backend IP  : ${backendIp.padEnd(38)}║
║  Backend URL : http://${backendIp}:5000/api        ║
║  Frontend URL: ${websiteUrl.substring(0, 38).padEnd(38)}║
╚══════════════════════════════════════════════════════╝

NEXT MANUAL STEPS (required before backend works):
─────────────────────────────────────────────────────
1. Add ${backendIp} to MongoDB Atlas → Network Access → Add IP

2. SSH into the Lightsail instance and deploy backend:
   a. Download the key pair from Lightsail console
   b. ssh -i dietly-key.pem ubuntu@${backendIp}
   c. Run these commands:
      cd /opt/bitnami
      git clone https://github.com/dietlyin/dietly-backend.git
      cd dietly-backend
      npm install
      
      # Create .env
      cat > .env << 'EOF'
      PORT=5000
      NODE_ENV=production
      MONGODB_URI=${MONGODB_URI}
      JWT_SECRET=${JWT_SECRET}
      JWT_EXPIRE=7d
      CORS_ORIGIN=*
      EOF
      
      # Start with PM2
      npm install -g pm2
      pm2 start src/server.js --name dietly-backend
      pm2 startup
      pm2 save

3. Test backend: curl http://${backendIp}:5000/api/health
4. Test frontend: ${websiteUrl}
5. ROTATE MongoDB Atlas DB user password (it was exposed earlier)
`);
  } catch (err) {
    console.error("\n❌ Deployment failed:", err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
