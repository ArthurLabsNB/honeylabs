'use client';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@lib/api';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as any;

    // @ts-ignore
    const captchaToken = (window.grecaptcha)
      ? await window.grecaptcha.execute(SITE_KEY, { action: 'login' })
      : 'test';

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
    <>
      <Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`} strategy="afterInteractive" />
      <form onSubmit={onSubmit}>
        <input name="correo" type="email" required />
        <input name="contrasena" type="password" required />
        <button disabled={loading} type="submit">Entrar</button>
      </form>
    </>
  );
}
