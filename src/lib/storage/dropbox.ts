import type { CloudProvider } from './index'

const dropbox: CloudProvider = {
  async upload(path, data) {
    // TODO: implementar subida a Dropbox
    return path
  },
  async download(path) {
    // TODO: implementar descarga de Dropbox
    return Buffer.from('')
  },
  async delete(path) {
    // TODO: implementar eliminado en Dropbox
  },
}

export default dropbox
