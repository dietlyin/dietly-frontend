/**
 * setup-backend.js
 *
 * Recreates the Lightsail instance with a userData launch script that
 * auto-deploys the backend — no SSH required.
 *
 * Required env vars:
 *   JWT_SECRET    — JWT signing secret
 *
 * Optional:
 *   REPO_URL      — git repo (default: https://github.com/dietlyin/dietly-backend.git)
 */

"use strict";

const {
  LightsailClient,
  GetStaticIpCommand,
  AllocateStaticIpCommand,
  DetachStaticIpCommand,
  DeleteInstanceCommand,
  GetInstanceCommand,
  CreateKeyPairCommand,
  CreateInstancesCommand,
  AttachStaticIpCommand,
  OpenInstancePublicPortsCommand,
} = require("@aws-sdk/client-lightsail");

const fs   = require("fs");
const path = require("path");
const os   = require("os");

// ── config ────────────────────────────────────────────────────────────────────
const REGION        = "ap-south-1";
const AZ            = "ap-south-1a";
const INSTANCE_NAME = "dietly-backend";
const BLUEPRINT_ID  = "nodejs";
const BUNDLE_ID     = "micro_3_1";
const STATIC_IP     = "dietly-static-ip";
const KEY_PAIR_NAME = process.env.KEY_PAIR_NAME || "dietly-key-v2";
const REPO_URL      = process.env.REPO_URL || "https://github.com/dietlyin/dietly-backend.git";
const KEY_FILE      = path.join(os.homedir(), ".ssh", `${KEY_PAIR_NAME}.pem`);

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET  = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ Set JWT_SECRET environment variable first.");
  process.exit(1);
}

const client = new LightsailClient({ region: REGION });
const log    = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// ── helpers ───────────────────────────────────────────────────────────────────
async function waitForInstance(name, targetState, timeoutMs = 300_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await sleep(8000);
    try {
      const { instance } = await client.send(new GetInstanceCommand({ instanceName: name }));
      const state = instance?.state?.name;
      log(`  Instance state: ${state}`);
      if (state === targetState) return instance;
    } catch (_) {}
  }
  throw new Error(`Instance did not reach '${targetState}' within ${timeoutMs / 1000}s`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── main ──────────────────────────────────────────────────────────────────────
(async () => {
  // ── Step 1: Detach static IP from old instance ──────────────────────────────
  log("Detaching static IP from old instance (if attached)...");
  try {
    const { staticIp } = await client.send(new GetStaticIpCommand({ staticIpName: STATIC_IP }));
    if (staticIp?.attachedTo) {
      await client.send(new DetachStaticIpCommand({ staticIpName: STATIC_IP }));
      log("Static IP detached.");
      await sleep(3000);
    } else {
      log("Static IP is not attached, skipping.");
    }
  } catch (e) {
    log(`Static IP lookup: ${e.message}`);
  }

  // ── Step 2: Delete old instance ─────────────────────────────────────────────
  log(`Deleting old instance '${INSTANCE_NAME}'...`);
  try {
    await client.send(new DeleteInstanceCommand({ instanceName: INSTANCE_NAME, forceDeleteAddOns: true }));
    log("Delete requested. Waiting for instance to be gone...");
    // Poll until GetInstance throws (instance removed)
    for (let i = 0; i < 30; i++) {
      await sleep(6000);
      try {
        const { instance } = await client.send(new GetInstanceCommand({ instanceName: INSTANCE_NAME }));
        log(`  Still deleting (state: ${instance?.state?.name})...`);
      } catch (err) {
        if (err.name === "NotFoundException" || err.__type?.includes("NotFoundException")) {
          log("Instance deleted.");
          break;
        }
        throw err;
      }
    }
  } catch (e) {
    if (e.name === "NotFoundException" || e.__type?.includes("NotFoundException")) {
      log("Instance not found, nothing to delete.");
    } else {
      log(`Delete error: ${e.message}`);
    }
  }

  await sleep(5000);

  // ── Step 3: Create (or reuse) key pair ──────────────────────────────────────
  log(`Creating key pair '${KEY_PAIR_NAME}'...`);
  let privateKeyPem;
  try {
    const { keyPair, privateKeyBase64 } = await client.send(
      new CreateKeyPairCommand({ keyPairName: KEY_PAIR_NAME })
    );
    if (typeof privateKeyBase64 === "string" && privateKeyBase64.trim().startsWith("-----BEGIN")) {
      privateKeyPem = privateKeyBase64;
    } else {
      privateKeyPem = Buffer.from(privateKeyBase64, "base64").toString("utf8");
    }

    if (!privateKeyPem || !privateKeyPem.includes("-----BEGIN") || !privateKeyPem.includes("PRIVATE KEY-----")) {
      throw new Error("Lightsail returned an unexpected private key format.");
    }

    fs.mkdirSync(path.dirname(KEY_FILE), { recursive: true });
    fs.writeFileSync(KEY_FILE, privateKeyPem, { encoding: "utf8", mode: 0o600 });
    log(`Key pair created. Private key saved to ${KEY_FILE}`);
  } catch (e) {
    if (e.name === "InvalidInputException" && e.message?.includes("already exists")) {
      log("Key pair already exists — continuing (no private key saved).");
    } else {
      log(`Key pair warning: ${e.message}`);
    }
  }

  // ── Step 4: Build userData launch script ────────────────────────────────────
    // Escape special chars in secrets
  const jwtEscaped      = JWT_SECRET.replace(/\\/g, "\\\\").replace(/`/g, "\\`");

  const userDataScript = `#!/bin/bash
exec > /var/log/dietly-setup.log 2>&1
set -e

echo "=== Dietly Backend Setup Start ==="
date

# Base packages
apt-get update -y
apt-get install -y ca-certificates curl gnupg git

# Install Node.js if missing
if ! command -v node >/dev/null 2>&1; then
  apt-get install -y nodejs npm
fi

echo "Node: $(node --version 2>/dev/null || echo not-found)"
echo "NPM:  $(npm --version 2>/dev/null || echo not-found)"

# Install MongoDB 7.0 for Ubuntu/Debian
. /etc/os-release
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
if [ "$ID" = "ubuntu" ]; then
  UBUNTU_CODENAME="\${VERSION_CODENAME:-jammy}"
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu \${UBUNTU_CODENAME}/mongodb-org/7.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-7.0.list
elif [ "$ID" = "debian" ]; then
  DEBIAN_CODENAME="\${VERSION_CODENAME:-bookworm}"
  echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian \${DEBIAN_CODENAME}/mongodb-org/7.0 main" > /etc/apt/sources.list.d/mongodb-org-7.0.list
else
  echo "Unsupported distro for MongoDB install: $ID"
  exit 1
fi

apt-get update -y
apt-get install -y mongodb-org
systemctl daemon-reload
systemctl enable mongod
systemctl start mongod
echo "MongoDB started."

# Install PM2 globally
npm install -g pm2

# Clone backend
cd /home/bitnami
sudo -u bitnami git clone ${REPO_URL} dietly-backend

# Write .env (no single-quote in values)
cat > /home/bitnami/dietly-backend/.env << ENVEOF
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/dietly
JWT_SECRET=${jwtEscaped}
JWT_EXPIRE=7d
CORS_ORIGIN=https://dietly.in
ENVEOF
chown bitnami:bitnami /home/bitnami/dietly-backend/.env

# Install dependencies
cd /home/bitnami/dietly-backend
sudo -u bitnami npm install --omit=dev

# Start with PM2 as bitnami user
su -s /bin/bash bitnami -c "cd /home/bitnami/dietly-backend && pm2 start src/server.js --name dietly-backend"
su -s /bin/bash bitnami -c "pm2 startup systemd -u bitnami --hp /home/bitnami"
su -s /bin/bash bitnami -c "pm2 save"

echo "=== Dietly Backend Setup Complete ==="
date
`;

  // ── Step 5: Create new instance ─────────────────────────────────────────────
  log(`Creating new instance '${INSTANCE_NAME}' with userData launch script...`);
  await client.send(
    new CreateInstancesCommand({
      instanceNames:    [INSTANCE_NAME],
      availabilityZone: AZ,
      blueprintId:      BLUEPRINT_ID,
      bundleId:         BUNDLE_ID,
      keyPairName:      KEY_PAIR_NAME,
      ipAddressType:    "ipv4",
      userData:         userDataScript,
    })
  );
  log("Create request sent. Waiting for instance to reach 'running'...");
  await waitForInstance(INSTANCE_NAME, "running");

  // ── Step 6: Open ports ───────────────────────────────────────────────────────
  log("Opening ports 22, 80, 443, 5000...");
  for (const [fromPort, toPort, protocol] of [
    [22, 22, "tcp"],
    [80, 80, "tcp"],
    [443, 443, "tcp"],
    [5000, 5000, "tcp"],
  ]) {
    await client.send(
      new OpenInstancePublicPortsCommand({
        instanceName: INSTANCE_NAME,
        portInfo: { fromPort, toPort, protocol },
      })
    );
  }

  // ── Step 7: Allocate static IP (if needed) and attach ───────────────────────
  log(`Ensuring static IP '${STATIC_IP}' exists...`);
  let staticIpAddress = "3.7.102.172";
  try {
    const { staticIp } = await client.send(new GetStaticIpCommand({ staticIpName: STATIC_IP }));
    staticIpAddress = staticIp.ipAddress;
    log(`Static IP already exists: ${staticIpAddress}`);
  } catch (e) {
    if (e.name === "NotFoundException" || e.__type?.includes("NotFoundException") || e.message?.includes("does not exist")) {
      log("Static IP not found — allocating new one...");
      const { staticIp } = await client.send(new AllocateStaticIpCommand({ staticIpName: STATIC_IP }));
      staticIpAddress = staticIp?.ipAddress || staticIpAddress;
      log(`New static IP allocated: ${staticIpAddress}`);
      await sleep(2000);
    } else {
      throw e;
    }
  }

  log(`Attaching static IP '${STATIC_IP}' → '${INSTANCE_NAME}'...`);
  await sleep(3000);
  await client.send(
    new AttachStaticIpCommand({ staticIpName: STATIC_IP, instanceName: INSTANCE_NAME })
  );
  log(`Static IP attached: ${staticIpAddress}`);

  // ── Done ─────────────────────────────────────────────────────────────────────
  console.log(`
╔══════════════════════════════════════════════════════╗
║           BACKEND INSTANCE READY                    ║
╠══════════════════════════════════════════════════════╣
║  IP          : ${staticIpAddress.padEnd(36)}║
║  Backend URL : http://${staticIpAddress}:5000/api${" ".repeat(Math.max(0, 14 - staticIpAddress.length))}║
╚══════════════════════════════════════════════════════╝

The userData script is now running on the instance.
It clones the repo, writes .env, and starts PM2 automatically.

Monitor setup progress (SSH key saved to ${KEY_FILE}):
  ssh -i ${KEY_FILE} bitnami@${staticIpAddress}
  tail -f /var/log/dietly-setup.log

Test when ready (give it ~3-5 mins):
  curl http://${staticIpAddress}:5000/api/health

MongoDB is running locally on this Lightsail instance:
  mongodb://localhost:27017/dietly
`);
})().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
