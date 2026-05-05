/**
 * setup-cdn-domain.js
 *
 * Step 1: Request ACM cert for dietly.in, print the DNS validation CNAME to add in Cloudflare.
 * Step 2 (--finalize): Once cert is validated, update CloudFront with the cert + alternate domains.
 *
 * Usage:
 *   node setup-cdn-domain.js            ← get validation CNAME
 *   node setup-cdn-domain.js --finalize ← update CloudFront (run after adding CNAME)
 */

"use strict";

const {
  ACMClient,
  RequestCertificateCommand,
  DescribeCertificateCommand,
  ListCertificatesCommand,
} = require("@aws-sdk/client-acm");

const {
  CloudFrontClient,
  ListDistributionsCommand,
  GetDistributionConfigCommand,
  UpdateDistributionCommand,
} = require("@aws-sdk/client-cloudfront");

const DOMAIN       = "dietly.in";
const BUCKET_EP    = "dietly-frontend-217343505350.s3-website.ap-south-1.amazonaws.com";
const FINALIZE     = process.argv.includes("--finalize");

// ACM for CloudFront MUST be in us-east-1
const acm = new ACMClient({ region: "us-east-1" });
const cf  = new CloudFrontClient({ region: "us-east-1" });
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ── Find or request certificate ───────────────────────────────────────────────
async function getOrRequestCert() {
  log("Checking for existing ACM certificate...");
  const { CertificateSummaryList } = await acm.send(
    new ListCertificatesCommand({ CertificateStatuses: ["ISSUED", "PENDING_VALIDATION"] })
  );
  const existing = CertificateSummaryList?.find(
    (c) => c.DomainName === DOMAIN || c.DomainName === `*.${DOMAIN}`
  );
  if (existing) {
    log(`Found existing cert: ${existing.CertificateArn}`);
    return existing.CertificateArn;
  }

  log(`Requesting new ACM certificate for ${DOMAIN} and *.${DOMAIN}...`);
  const { CertificateArn } = await acm.send(
    new RequestCertificateCommand({
      DomainName:              DOMAIN,
      SubjectAlternativeNames: [`*.${DOMAIN}`],
      ValidationMethod:        "DNS",
      IdempotencyToken:        "dietly2026",
    })
  );
  log(`Certificate requested: ${CertificateArn}`);
  return CertificateArn;
}

// ── Get validation records ────────────────────────────────────────────────────
async function getValidationRecords(arn) {
  for (let i = 0; i < 10; i++) {
    const { Certificate } = await acm.send(new DescribeCertificateCommand({ CertificateArn: arn }));
    const options = Certificate.DomainValidationOptions || [];
    const records = options
      .filter((o) => o.ResourceRecord)
      .map((o) => o.ResourceRecord);
    if (records.length > 0) return { records, status: Certificate.Status };
    log("Waiting for validation records to appear...");
    await sleep(4000);
  }
  throw new Error("Validation records not available yet. Try again in a minute.");
}

// ── Update CloudFront ─────────────────────────────────────────────────────────
async function updateCloudFront(certArn) {
  log("Finding CloudFront distribution...");
  const { DistributionList } = await cf.send(new ListDistributionsCommand({}));
  const dist = DistributionList?.Items?.find((d) =>
    d.Origins?.Items?.some((o) => o.DomainName === BUCKET_EP)
  );
  if (!dist) throw new Error("Distribution not found.");
  log(`Distribution: ${dist.Id}`);

  const { DistributionConfig, ETag } = await cf.send(
    new GetDistributionConfigCommand({ Id: dist.Id })
  );

  // Set alternate domain names
  DistributionConfig.Aliases = {
    Quantity: 2,
    Items: [DOMAIN, `www.${DOMAIN}`],
  };

  // Set ACM certificate
  DistributionConfig.ViewerCertificate = {
    ACMCertificateArn:      certArn,
    SSLSupportMethod:       "sni-only",
    MinimumProtocolVersion: "TLSv1.2_2021",
    CertificateSource:      "acm",
  };

  log("Updating distribution with certificate and alternate domain names...");
  const { Distribution } = await cf.send(
    new UpdateDistributionCommand({
      Id: dist.Id,
      IfMatch: ETag,
      DistributionConfig,
    })
  );

  console.log(`
✅ CloudFront updated!
   Status : ${Distribution.Status}
   Domain : https://${dist.DomainName}

Changes will propagate in ~5-10 minutes.
Once deployed, https://dietly.in will work correctly.
`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const certArn = await getOrRequestCert();

  if (!FINALIZE) {
    // Step 1: Show validation CNAME
    const { records, status } = await getValidationRecords(certArn);

    if (status === "ISSUED") {
      console.log(`\n✅ Certificate already ISSUED: ${certArn}\n`);
      console.log('Run: node setup-cdn-domain.js --finalize\n');
      return;
    }

    console.log(`
━━━ ACM Certificate Validation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Certificate ARN: ${certArn}
Status: ${status}

Add the following CNAME(s) in Cloudflare DNS to validate:
`);
    for (const r of records) {
      // Strip trailing dot from DNS names (Cloudflare doesn't need it)
      const name   = r.Name.replace(/\.$/, "").replace(`.${DOMAIN}`, "");
      const target = r.Value.replace(/\.$/, "");
      console.log(`  Type   : CNAME`);
      console.log(`  Name   : ${name}`);
      console.log(`  Target : ${target}`);
      console.log(`  Proxy  : DNS only (grey cloud)\n`);
    }
    console.log(`After adding the CNAME, wait ~1-2 minutes for validation, then run:`);
    console.log(`  node setup-cdn-domain.js --finalize\n`);
  } else {
    // Step 2: Check cert is issued, then update CloudFront
    log("Checking certificate status...");
    const { Certificate } = await acm.send(new DescribeCertificateCommand({ CertificateArn: certArn }));
    if (Certificate.Status !== "ISSUED") {
      console.error(`\n❌ Certificate is not yet ISSUED (status: ${Certificate.Status})`);
      console.error("   Add the validation CNAME in Cloudflare, wait 1-2 mins, then retry.\n");
      process.exit(1);
    }
    log(`Certificate is ISSUED: ${certArn}`);
    await updateCloudFront(certArn);
  }
})().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
