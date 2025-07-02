import { verify } from 'sigstore';

export async function verifyModel(path: string) {
  try {
    const sig = await fetch(`${path}.sig`).then(r => r.text());
    await verify(path, sig);
    return true;
  } catch {
    return false;
  }
}
