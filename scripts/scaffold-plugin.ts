import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error('Usage: scaffold-plugin <name>');
    process.exit(1);
  }
  const dir = path.join('packages/plugins', name);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.ts'), `export default function() {\n  console.log('${name} loaded');\n}\n`);
  const metaPath = path.join('packages/plugins', 'metadata.json');
  const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
  meta.plugins.push({ name, entry: `./${name}/index.js` });
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
  console.log('Plugin scaffolded:', name);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
