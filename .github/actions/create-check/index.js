const core = require('@actions/core');

async function run() {
  try {
    const token = core.getInput('token');
    const repo = core.getInput('repo');
    const sha = core.getInput('sha');
    const name = core.getInput('name');
    const resp = await fetch(`https://api.github.com/repos/${repo}/check-runs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'honeylabs-create-check',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({ name, head_sha: sha, status: 'in_progress' }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(JSON.stringify(data));
    core.setOutput('id', data.id);
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
