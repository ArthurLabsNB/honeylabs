const fs = require('fs/promises');
const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function main() {
  const [sha, version] = process.argv.slice(2);
  if (!sha || !version) {
    console.error('Usage: node update-app-info.js <sha> <version>');
    process.exit(1);
  }
  const file = path.join(process.cwd(), 'lib', 'app-info.json');

  let url = `https://github.com/${process.env.GITHUB_REPOSITORY}/releases/latest/download/app-release.apk`;
  const bucket = process.env.AWS_S3_BUCKET;
  const key = process.env.AWS_S3_KEY || `app-release-${version}.apk`;
  if (bucket && process.env.AWS_REGION) {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    try {
      url = await getSignedUrl(client, command, { expiresIn: 900 });
    } catch (err) {
      console.error('Failed to generate signed URL', err);
    }
  }

  const info = {
    version,
    url,
    sha256: sha,
    building: false,
    progress: 1,
  };
  await fs.writeFile(file, JSON.stringify(info, null, 2));
}

main();
