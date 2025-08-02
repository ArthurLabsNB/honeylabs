'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@lib/api';
import { executeRecaptcha, isRecaptchaEnabled } from '@lib/recaptcha';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const captchaEnabled = isRecaptchaEnabled();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as any;

    let captchaToken: string | null = 'test';
    if (captchaEnabled) {
      captchaToken = await executeRecaptcha('login');
      if (!captchaToken) {
        alert('Error al verificar captcha');
        setLoading(false);
        return;
      }
    }

    const res = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        correo: form.correo.value,
        contrasena: form.contrasena.value,
        captchaToken,
      }),
    });

    if (res.ok) {
      router.replace('/');
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? 'Error de login');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="correo" type="email" required />
      <input name="contrasena" type="password" required />
      <button disabled={loading} type="submit">Entrar</button>
    </form>
  );
}
