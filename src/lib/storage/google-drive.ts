import type { CloudProvider } from './index'

const googleDrive: CloudProvider = {
  async upload(path, data) {
    // TODO: implementar subida a Google Drive
    return path
  },
  async download(path) {
    // TODO: implementar descarga de Google Drive
    return Buffer.from('')
  },
  async delete(path) {
    // TODO: implementar eliminado en Google Drive
  },
}

export default googleDrive
