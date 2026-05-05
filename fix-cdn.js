/**
 * fix-cdn.js
 *
 * Fixes CloudFront 403: adds a custom Host header on the S3 origin so
 * CloudFront sends the correct Host when forwarding requests to S3.
 */

"use strict";

const {
  CloudFrontClient,
  ListDistributionsCommand,
  GetDistributionConfigCommand,
  UpdateDistributionCommand,
} = require("@aws-sdk/client-cloudfront");

const BUCKET_WEBSITE_ENDPOINT =
  "dietly-frontend-217343505350.s3-website.ap-south-1.amazonaws.com";

const client = new CloudFrontClient({ region: "us-east-1" });
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

(async () => {
  // 1. Find the distribution
  log("Finding CloudFront distribution...");
  const { DistributionList } = await client.send(new ListDistributionsCommand({}));
  const dist = DistributionList?.Items?.find((d) =>
    d.Origins?.Items?.some((o) => o.DomainName === BUCKET_WEBSITE_ENDPOINT)
  );
  if (!dist) throw new Error("Distribution not found — run setup-cdn.js first.");
  log(`Found distribution: ${dist.Id} (${dist.DomainName})`);

  // 2. Get full config + ETag
  log("Fetching distribution config...");
  const { DistributionConfig, ETag } = await client.send(
    new GetDistributionConfigCommand({ Id: dist.Id })
  );

  // 3. Patch the S3 origin: add Host custom header
  const origin = DistributionConfig.Origins.Items.find(
    (o) => o.DomainName === BUCKET_WEBSITE_ENDPOINT
  );

  const existingHeaders = origin.CustomHeaders?.Items || [];
  const alreadySet = existingHeaders.some((h) => h.HeaderName.toLowerCase() === "host");

  if (alreadySet) {
    log("Host header already set on origin — no changes needed.");
  } else {
    origin.CustomHeaders = {
      Quantity: existingHeaders.length + 1,
      Items: [
        ...existingHeaders,
        { HeaderName: "Host", HeaderValue: BUCKET_WEBSITE_ENDPOINT },
      ],
    };
    log(`Added Host: ${BUCKET_WEBSITE_ENDPOINT} to origin headers.`);
  }

  // 4. Update distribution
  log("Updating distribution...");
  const { Distribution } = await client.send(
    new UpdateDistributionCommand({
      Id: dist.Id,
      IfMatch: ETag,
      DistributionConfig,
    })
  );

  console.log(`
✅ Distribution updated.
   Status: ${Distribution.Status}  (changes take ~5 mins to propagate)

   Test: https://${Distribution.DomainName}
`);
})().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
