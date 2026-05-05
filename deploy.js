#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
const mime = require('mime-types');

require('dotenv').config();

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const CF_DISTRIBUTION_ID = process.env.AWS_CF_DISTRIBUTION_ID;

if (!S3_BUCKET || !CF_DISTRIBUTION_ID) {
  console.error('ERROR: Missing AWS_S3_BUCKET or AWS_CF_DISTRIBUTION_ID environment variables');
  process.exit(1);
}

const s3Client = new S3Client({ region: AWS_REGION });
const cfClient = new CloudFrontClient({ region: AWS_REGION });

async function uploadToS3(filePath, s3Key, cacheControl = 'public, max-age=3600') {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  console.log(`Uploading: ${s3Key}`);

  const params = {
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: cacheControl,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log(`✓ Uploaded: ${s3Key}`);
  } catch (error) {
    console.error(`✗ Failed to upload ${s3Key}:`, error.message);
    throw error;
  }
}

async function deleteS3Object(s3Key) {
  const params = {
    Bucket: S3_BUCKET,
    Key: s3Key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`✓ Deleted: ${s3Key}`);
  } catch (error) {
    console.error(`✗ Failed to delete ${s3Key}:`, error.message);
  }
}

async function listS3Objects(prefix = '') {
  const params = {
    Bucket: S3_BUCKET,
    Prefix: prefix,
  };

  try {
    const response = await s3Client.send(new ListObjectsV2Command(params));
    return response.Contents || [];
  } catch (error) {
    console.error('Failed to list S3 objects:', error.message);
    return [];
  }
}

async function deployDirectory(localDir, s3Prefix = '', noCachePatterns = []) {
  const files = fs.readdirSync(localDir, { withFileTypes: true });

  for (const file of files) {
    const localPath = path.join(localDir, file.name);
    const s3Key = s3Prefix ? `${s3Prefix}/${file.name}` : file.name;

    if (file.isDirectory()) {
      await deployDirectory(localPath, s3Key, noCachePatterns);
    } else {
      const isCacheExempt = noCachePatterns.some(pattern => s3Key.match(pattern));
      const cacheControl = isCacheExempt ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600';
      await uploadToS3(localPath, s3Key, cacheControl);
    }
  }
}

async function invalidateCloudFront() {
  console.log('Invalidating CloudFront cache...');

  const params = {
    DistributionId: CF_DISTRIBUTION_ID,
    InvalidationBatch: {
      Paths: {
        Quantity: 1,
        Items: ['/*'],
      },
      CallerReference: Date.now().toString(),
    },
  };

  try {
    const response = await cfClient.send(new CreateInvalidationCommand(params));
    console.log(`✓ CloudFront invalidation created: ${response.Invalidation.Id}`);
  } catch (error) {
    console.error('✗ Failed to invalidate CloudFront:', error.message);
    throw error;
  }
}

async function deploy() {
  try {
    console.log('🚀 Starting AWS S3 deployment...\n');

    const distPath = path.join(__dirname, 'frontend', 'dist');

    if (!fs.existsSync(distPath)) {
      console.error(`ERROR: Build directory not found: ${distPath}`);
      console.error('Run: npm run build in the frontend directory first');
      process.exit(1);
    }

    console.log('📤 Uploading files to S3...');
    await deployDirectory(distPath, '', [/index\.html$/]);

    console.log('\n🔄 Invalidating CloudFront cache...');
    await invalidateCloudFront();

    console.log('\n✅ Deployment completed successfully!');
    console.log(`🌐 Frontend URL: https://${process.env.FRONTEND_DOMAIN || 'your-domain.com'}`);
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();
