const fs = require('fs/promises')
const path = require('path')

async function main() {
  const [runId, pct] = process.argv.slice(2)
  const progress = Math.max(0, Math.min(1, parseFloat(pct || '0')))
  const building = progress < 1
  const file = path.join(process.cwd(), 'lib', 'build-status.json')
  await fs.writeFile(file, JSON.stringify({ building, progress }))

  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPOSITORY
  if (runId && token && repo) {
    try {
      await fetch(`https://api.github.com/repos/${repo}/check-runs/${runId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'honeylabs-status',
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({
          status: building ? 'in_progress' : 'completed',
          conclusion: building ? undefined : 'success',
          output: { title: 'mobile', summary: `progress:${progress}` },
        }),
      })
    } catch (err) {
      console.error('update-status', err)
    }
  }
}

main()

