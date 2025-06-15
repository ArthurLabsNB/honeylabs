import LZString from 'lz-string'
import QRCode from 'qrcode'

export const encodeQR = (data: any): string =>
  LZString.compressToEncodedURIComponent(JSON.stringify(data))

export const decodeQR = <T = any>(code: string): T | null => {
  try {
    const txt = LZString.decompressFromEncodedURIComponent(code)
    return txt ? (JSON.parse(txt) as T) : null
  } catch {
    return null
  }
}

export const buildQRDataURL = async (data: any): Promise<string> => {
  const str = encodeQR(data)
  return QRCode.toDataURL(str)
}
