import fs from 'fs/promises'
import path from 'path'

export const buildStatusPath = path.join(process.cwd(), 'public', 'build-status.json')

export type BuildStatus = {
  building: boolean
  progress: number
  timestamp?: number
  error?: string
}

export async function updateBuildStatus(data: BuildStatus) {
  await fs.writeFile(buildStatusPath, JSON.stringify({ ...data, timestamp: Date.now() }))
}

export async function readBuildStatus(): Promise<BuildStatus> {
  try {
    const raw = await fs.readFile(buildStatusPath, 'utf8')
    return JSON.parse(raw) as BuildStatus
  } catch {
    return { building: false, progress: 0 }
  }
}
