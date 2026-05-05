/**
 * setup-cdn.js
 *
 * Creates a CloudFront distribution in front of the S3 frontend bucket.
 * Outputs the CloudFront domain to add as a CNAME in Cloudflare for dietly.in
 */

"use strict";

const {
  CloudFrontClient,
  CreateDistributionCommand,
  ListDistributionsCommand,
} = require("@aws-sdk/client-cloudfront");

const BUCKET_WEBSITE_ENDPOINT =
  "dietly-frontend-217343505350.s3-website.ap-south-1.amazonaws.com";
const CALLER_REF = `dietly-frontend-${Date.now()}`;

const client = new CloudFrontClient({ region: "us-east-1" }); // CloudFront is global, always us-east-1
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

(async () => {
  // ── Check if distribution already exists ──────────────────────────────────
  log("Checking for existing CloudFront distributions...");
  const { DistributionList } = await client.send(new ListDistributionsCommand({}));
  const existing = DistributionList?.Items?.find((d) =>
    d.Origins?.Items?.some((o) => o.DomainName === BUCKET_WEBSITE_ENDPOINT)
  );
  if (existing) {
    console.log(`
✅ CloudFront distribution already exists!

  CloudFront Domain : ${existing.DomainName}
  Status            : ${existing.Status}

Add this in Cloudflare DNS:
  Type   : CNAME
  Name   : dietly.in  (or @)
  Target : ${existing.DomainName}
  Proxy  : DNS only (grey cloud) — required for apex CNAME flattening
`);
    return;
  }

  // ── Create distribution ────────────────────────────────────────────────────
  log("Creating CloudFront distribution...");
  const { Distribution } = await client.send(
    new CreateDistributionCommand({
      DistributionConfig: {
        CallerReference: CALLER_REF,
        Comment: "Dietly frontend — S3 static website",
        Enabled: true,
        HttpVersion: "http2and3",
        PriceClass: "PriceClass_200", // US, EU, Asia (covers India)
        DefaultRootObject: "index.html",

        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: "s3-website",
              DomainName: BUCKET_WEBSITE_ENDPOINT,
              CustomOriginConfig: {
                HTTPPort: 80,
                HTTPSPort: 443,
                OriginProtocolPolicy: "http-only", // S3 website endpoint is HTTP only
                OriginSSLProtocols: { Quantity: 1, Items: ["TLSv1.2"] },
              },
            },
          ],
        },

        DefaultCacheBehavior: {
          TargetOriginId: "s3-website",
          ViewerProtocolPolicy: "redirect-to-https",
          CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized managed policy
          Compress: true,
          AllowedMethods: {
            Quantity: 2,
            Items: ["GET", "HEAD"],
            CachedMethods: { Quantity: 2, Items: ["GET", "HEAD"] },
          },
        },

        // SPA support: serve index.html for 403/404 (S3 returns 403 for missing routes)
        CustomErrorResponses: {
          Quantity: 2,
          Items: [
            {
              ErrorCode: 403,
              ResponseCode: "200",
              ResponsePagePath: "/index.html",
              ErrorCachingMinTTL: 0,
            },
            {
              ErrorCode: 404,
              ResponseCode: "200",
              ResponsePagePath: "/index.html",
              ErrorCachingMinTTL: 0,
            },
          ],
        },
      },
    })
  );

  const domain = Distribution.DomainName;
  const id     = Distribution.Id;
  const status = Distribution.Status;

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              CLOUDFRONT DISTRIBUTION CREATED                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Distribution ID : ${id.padEnd(41)}║
║  CloudFront URL  : https://${domain.padEnd(34)}║
║  Status          : ${status.padEnd(41)}║
╚═══════════════════════════════════════════════════════════════╝

⏳ CloudFront takes ~10-15 minutes to deploy globally.
   Status will change from "InProgress" → "Deployed".

━━━ Add this in Cloudflare DNS for dietly.in ━━━━━━━━━━━━━━━━━━━

  Type   : CNAME
  Name   : @  (or dietly.in)
  Target : ${domain}
  Proxy  : ☁  Proxied (orange cloud) — enables Cloudflare CDN + SSL

Also add www:
  Type   : CNAME
  Name   : www
  Target : ${domain}
  Proxy  : ☁  Proxied

━━━ Also add backend API subdomain ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Type   : A
  Name   : api
  Target : 3.7.102.172
  Proxy  : ☁  Proxied  (or DNS only if you hit issues)

Then update frontend API URL to: https://api.dietly.in/api
`);
})().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
