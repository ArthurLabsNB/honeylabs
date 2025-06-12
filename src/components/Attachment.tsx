interface Props {
  data: string
  tipo: string | null
  nombre: string | null
}

export default function Attachment({ data, tipo, nombre }: Props) {
  if (!data) return null
  const src = `data:${tipo || 'application/octet-stream'};base64,${data}`
  if (tipo && tipo.startsWith('image/')) {
    return <img src={src} alt={nombre || 'archivo'} className="mt-2 max-h-48" />
  }
  if (tipo && tipo.startsWith('video/')) {
    return (
      <video src={src} controls className="mt-2 max-h-48" />
    )
  }
  if (tipo && tipo.startsWith('audio/')) {
    return <audio src={src} controls className="mt-2" />
  }
  return (
    <a href={src} download={nombre || 'archivo'} className="text-blue-600 underline mt-2 block">
      {nombre || 'Descargar archivo'}
    </a>
  )
}
