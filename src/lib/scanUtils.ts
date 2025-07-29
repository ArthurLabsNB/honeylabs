export const hasCamera = async (): Promise<boolean> => {
  if (!navigator.mediaDevices?.enumerateDevices) return false;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === 'videoinput');
  } catch {
    return false;
  }
};

import { apiFetch } from '@lib/api';
import { jsonOrNull } from '@lib/http';

export const fetchScanInfo = async (codigo: string): Promise<any | null> => {
  const res = await apiFetch('/api/qr/importar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo }),
  });
  return jsonOrNull(res);
};
