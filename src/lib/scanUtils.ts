import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { apiFetch } from '@lib/api';
import { jsonOrNull } from '@lib/http';

export const hasCamera = async (): Promise<boolean> => {
  if (!navigator.mediaDevices?.enumerateDevices) return false;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === 'videoinput');
  } catch {
    return false;
  }
};

export const fetchScanInfo = async (codigo: string): Promise<any | null> => {
  const res = await apiFetch('/api/qr/importar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo }),
  });
  return jsonOrNull(res);
};

export const stopScannerSafely = async (qr: Html5Qrcode): Promise<void> => {
  try {
    if (qr.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
      await qr.stop();
    }
  } catch {}
};
