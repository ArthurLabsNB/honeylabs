import { promisify } from 'util'
import { exec as execCb } from 'child_process'

const exec = promisify(execCb)

/**
 * Devuelve true si existen cambios en archivos nativos
 * desde el último commit.
 */
export async function detectNativeChanges(): Promise<boolean> {
  try {
    const { stdout } = await exec('git diff --name-only HEAD~1')
    const files = stdout.split('\n').filter(Boolean)
    return files.some((f) =>
      f.startsWith('android/') ||
      f.startsWith('packages/mobile-plugins/') ||
      f.startsWith('capacitor.config')
    )
  } catch {
    return false
  }
}

