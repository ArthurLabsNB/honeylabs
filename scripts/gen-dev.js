const { spawnSync } = require('child_process');

const useDataProxy = process.env.PRISMA_DATA_PROXY === 'true';
const args = ['generate'];
if (useDataProxy) args.push('--data-proxy');

const result = spawnSync('prisma', args, { stdio: 'inherit' });
process.exit(result.status ?? 0);
