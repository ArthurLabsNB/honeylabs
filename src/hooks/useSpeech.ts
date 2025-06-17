import { useEffect, useState } from 'react'

export default function useSpeech() {
  const [texto, setTexto] = useState('')
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    if (!activo) return
    const rec = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition()
    rec.lang = 'es-ES'
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(' ')
      setTexto(t)
    }
    rec.start()
    return () => rec.stop()
  }, [activo])

  return { texto, activo, setActivo }
}
