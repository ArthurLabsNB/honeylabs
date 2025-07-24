import { Html5Qrcode } from 'html5-qrcode'

export const decodeQRImageFile = async (file: File): Promise<string | null> => {
  try {
    const qr = new Html5Qrcode('qr-image-reader')
    const text = await qr.scanFile(file, false)
    qr.clear()
    return text
  } catch {
    return null
  }
}
