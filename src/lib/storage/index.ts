export interface CloudProvider {
  upload(path: string, data: Buffer | Blob | string): Promise<string>
  download(path: string): Promise<Buffer>
  delete(path: string): Promise<void>
}

export { default as googleDrive } from './google-drive'
export { default as dropbox } from './dropbox'
