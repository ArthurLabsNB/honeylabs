"use client"
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { generarUUID } from '@/lib/uuid'
import MediaWidget from '../../../components/widgets/MediaWidget'
import { useToast } from '@/components/Toast'
import useNotas from '@/hooks/useNotas'

interface DocItem { id: number; name: string; contenido: string }

export default function NotasTab({ tabId }: { tabId: string }) {
  const { notas, crear, actualizar, eliminar, mutate } = useNotas(tabId)
  const toast = useToast()
  const [input, setInput] = useState('')

  const [imgOrder, setImgOrder] = useState<number[]>([])
  const [urlOrder, setUrlOrder] = useState<number[]>([])
  const [docOrder, setDocOrder] = useState<number[]>([])

  const images = useMemo(() => notas.filter(n => n.tipo === 'imagen'), [notas])
  const urls = useMemo(() => notas.filter(n => n.tipo === 'url'), [notas])
  const docs = useMemo(() => notas.filter(n => n.tipo === 'doc') as DocItem[], [notas])
  const stickies = notas.filter(n => n.tipo === 'sticky')

  useEffect(() => {
    setImgOrder(images.map(n => n.id))
    setUrlOrder(urls.map(n => n.id))
    setDocOrder(docs.map(n => n.id))
  }, [images, urls, docs])

  const move = (arr: number[], from: number, to: number) => {
    const copy = arr.slice()
    const [it] = copy.splice(from, 1)
    copy.splice(to, 0, it)
    return copy
  }

  const moveImage = (idx: number, dir: number) =>
    setImgOrder(o => move(o, idx, idx + dir))
  const moveUrl = (idx: number, dir: number) =>
    setUrlOrder(o => move(o, idx, idx + dir))
  const moveDoc = (idx: number, dir: number) =>
    setDocOrder(o => move(o, idx, idx + dir))

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const res = reader.result
        if (typeof res === 'string') {
          const comma = res.indexOf(',')
          resolve(comma >= 0 ? res.slice(comma + 1) : res)
        } else reject(new Error('read error'))
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const onDrop = useCallback(
    async (accepted: File[]) => {
      for (const file of accepted) {
        if (file.type.startsWith('image/')) {
          const b64 = await fileToBase64(file)
          await crear('imagen', b64)
        } else if (file.name.match(/\.docx$/i)) {
          const b64 = await fileToBase64(file)
          await crear('doc', b64)
        }
      }
      mutate()
    },
    [crear, mutate],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleCommand = async () => {
    if (input.startsWith('/imagen ')) {
      const val = input.replace('/imagen ', '').trim()
      if (val) await crear('imagen', val)
      setInput('')
      mutate()
      return
    }
    if (input.startsWith('/url ')) {
      const val = input.replace('/url ', '').trim()
      if (val) await crear('url', val)
      setInput('')
      mutate()
      return
    }
    if (input.startsWith('/postit ')) {
      const text = input.replace('/postit ', '').trim()
      if (text) await crear('sticky', text)
      setInput('')
      mutate()
      return
    }
  }

  const updateSticky = async (id: number, text: string) => {
    await actualizar(id, text)
    mutate()
  }

  return (
    <div className="space-y-4" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleCommand()
            }
          }}
          className="flex-1 px-2 py-1 rounded text-black"
          placeholder="/imagen /url /postit"
        />
        <button onClick={handleCommand} className="no-drag px-3 py-1 bg-white/20 rounded">
          Añadir
        </button>
      </div>
      {isDragActive && (
        <div className="p-4 border rounded border-dashed text-center">
          Suelta archivos aquí
        </div>
      )}
      {images.length > 0 && (
        <div className="notas-grid">
          {imgOrder.map((id, idx) => {
            const it = images.find(i => i.id === id)
            if (!it) return null
            return (
              <div key={id} className="space-y-1">
                <img
                  src={`data:image/*;base64,${it.contenido}`}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="flex gap-1 text-xs">
                  <button onClick={() => moveImage(idx, -1)} disabled={idx === 0}>↑</button>
                  <button onClick={() => moveImage(idx, 1)} disabled={idx === imgOrder.length - 1}>↓</button>
                  <button onClick={() => eliminar(id)}>X</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {urlOrder.map((id, idx) => {
        const it = urls.find(u => u.id === id)
        if (!it) return null
        return (
          <div key={id} className="h-40 space-y-1">
            <MediaWidget url={it.contenido} />
            <div className="flex gap-1 text-xs">
              <button onClick={() => moveUrl(idx, -1)} disabled={idx === 0}>↑</button>
              <button onClick={() => moveUrl(idx, 1)} disabled={idx === urlOrder.length - 1}>↓</button>
              <button onClick={() => eliminar(id)}>X</button>
            </div>
          </div>
        )
      })}
      {docOrder.map((id, idx) => {
        const it = docs.find(d => d.id === id)
        if (!it) return null
        return (
          <div key={id} className="space-y-1">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(it.contenido)}`}
              className="w-full h-48"
            />
            <div className="flex gap-1 text-xs">
              <a href={`ms-word:ofe|u|${it.contenido}`} className="underline">Editar</a>
              <a href={it.contenido} download className="underline">Descargar</a>
              <button onClick={() => moveDoc(idx, -1)} disabled={idx === 0}>↑</button>
              <button onClick={() => moveDoc(idx, 1)} disabled={idx === docOrder.length - 1}>↓</button>
              <button onClick={() => eliminar(id)}>X</button>
            </div>
          </div>
        )
      })}
      {stickies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stickies.map(s => (
            <div key={s.id} className="relative">
              <textarea
                value={s.contenido}
                onChange={e => updateSticky(s.id, e.target.value)}
                className="no-drag bg-yellow-200 text-black p-2 rounded w-32 h-32 resize-none"
              />
              <div className="flex gap-1 text-xs mt-1">
                <button onClick={() => eliminar(s.id)}>Borrar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
