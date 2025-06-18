"use client"
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileDropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) onFiles(accepted)
  }, [onFiles])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  return (
    <div
      {...getRootProps()}
      className={`fixed inset-0 z-30 ${isDragActive ? 'bg-black/40' : 'pointer-events-none'}`}
    >
      <input {...getInputProps()} />
    </div>
  )
}
