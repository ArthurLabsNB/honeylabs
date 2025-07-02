const fs = require('fs/promises');
const path = require('path');

async function main() {
  const [sha, version] = process.argv.slice(2);
  if (!sha || !version) {
    console.error('Usage: node update-app-info.js <sha> <version>');
    process.exit(1);
  }
  const file = path.join(process.cwd(), 'lib', 'app-info.json');
  const info = {
    version,
    url: `https://github.com/${process.env.GITHUB_REPOSITORY}/releases/latest/download/app-release.apk`,
    sha256: sha,
    building: false,
    progress: 1,
  };
  await fs.writeFile(file, JSON.stringify(info, null, 2));
}

main();
