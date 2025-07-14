"use client"
import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { generarUUID } from '@/lib/uuid'
import MediaWidget from '../../../components/widgets/MediaWidget'

interface DocItem { name: string; url: string }
interface Sticky { id: string; text: string }

export default function NotasTab({ tabId }: { tabId: string }) {
  const [images, setImages] = useState<string[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [docs, setDocs] = useState<DocItem[]>([])
  const [stickies, setStickies] = useState<Sticky[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`notas-${tabId}`)
      if (!raw) return
      const data = JSON.parse(raw) as {
        images?: string[]
        urls?: string[]
        docs?: DocItem[]
        stickies?: Sticky[]
      }
      setImages(data.images || [])
      setUrls(data.urls || [])
      setDocs(data.docs || [])
      setStickies(data.stickies || [])
    } catch {}
  }, [tabId])

  useEffect(() => {
    const data = { images, urls, docs, stickies }
    try {
      localStorage.setItem(`notas-${tabId}`, JSON.stringify(data))
    } catch {}
  }, [images, urls, docs, stickies, tabId])

  const onDrop = useCallback((accepted: File[]) => {
    accepted.forEach(file => {
      const url = URL.createObjectURL(file)
      if (file.type.startsWith('image/')) setImages(i => [...i, url])
      else if (file.name.match(/\.docx$/i))
        setDocs(d => [...d, { name: file.name, url }])
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleCommand = () => {
    if (input.startsWith('/imagen ')) {
      const url = input.replace('/imagen ', '').trim()
      if (url) setImages(i => [...i, url])
      setInput('')
      return
    }
    if (input.startsWith('/url ')) {
      const url = input.replace('/url ', '').trim()
      if (url) setUrls(u => [...u, url])
      setInput('')
      return
    }
    if (input.startsWith('/postit ')) {
      const text = input.replace('/postit ', '').trim()
      if (text) setStickies(s => [...s, { id: generarUUID(), text }])
      setInput('')
      return
    }
  }

  const updateSticky = (id: string, text: string) =>
    setStickies(s => s.map(st => (st.id === id ? { ...st, text } : st)))

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
        <div className="grid grid-cols-2 gap-2">
          {images.map(src => (
            <img key={src} src={src} className="w-full h-32 object-cover rounded" />
          ))}
        </div>
      )}
      {urls.map(url => (
        <div key={url} className="h-40">
          <MediaWidget url={url} />
        </div>
      ))}
      {docs.map(doc => (
        <div key={doc.url} className="space-y-1">
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(doc.url)}`}
            className="w-full h-48"
          />
          <div className="flex gap-2 text-xs">
            <a href={`ms-word:ofe|u|${doc.url}`} className="underline">
              Editar
            </a>
            <a href={doc.url} download={doc.name} className="underline">
              Descargar
            </a>
          </div>
        </div>
      ))}
      {stickies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stickies.map(s => (
            <textarea
              key={s.id}
              value={s.text}
              onChange={e => updateSticky(s.id, e.target.value)}
              className="no-drag bg-yellow-200 text-black p-2 rounded w-32 h-32 resize-none"
            />
          ))}
        </div>
      )}
    </div>
  )
}
