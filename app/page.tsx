/* eslint-disable @next/next/no-img-element */
'use client'

import { useToPng } from '@hugocxl/react-to-image'
import * as ExifReader from 'exifreader'
import heic2any from 'heic2any'
import { Caveat } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'

const caveat = Caveat({ subsets: ['latin'] })

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<ExifReader.Tags | null>(null)
  const refWrap = useRef<HTMLDivElement>(null)
  const [_, convert, ref] = useToPng({
    onSuccess: base64 => {
      setResult(base64)
      if (!refWrap.current) return
      refWrap.current.classList.add('hidden')
    },
    onError: err => setError(err)
  })

  useEffect(() => {
    if (files) {
      (async () => {
        const file = files[0]
        const tags = await ExifReader.load(file)
        if (!tags?.FocalLengthIn35mmFilm?.description) {
          setError('No EXIF data found')
          return
        }
        setMetadata(tags)

        if (file.name.toLowerCase().endsWith('.heic')) {
          const blob = await heic2any({ blob: file })
          setBlob(blob as Blob)
        } else {
          const blob = new Blob([file], { type: file.type })
          setBlob(blob)
        }
      })()
    }
  }, [files])

  useEffect(() => {
    if (isReady) {
      if (!refWrap.current) return
      refWrap.current.classList.remove('hidden')
      convert()
    }
  }, [isReady])

  return <div className="min-h-svh">
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <a className={`${caveat.className} btn btn-ghost text-3xl`}>What The Frame</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        </button>
      </div>
    </div>
    <div className="container mx-auto space-y-4 py-6">
      {files && !result ? <p className="text-center">Processing...</p> : <>
        {error ? <p className="text-red-400 text-center">{error}</p> : <></>}
      </>}
      {result ? <div className="space-y-4 flex items-center flex-col">
        <img src={result} className="max-w-sm w-full border" alt="Image" />
        <div className="flex gap-3">
          <a href={result} download="shot.png" className="btn btn-neutral">Download</a>
          <button className="btn btn-ghost" onClick={() => {
            window.location.reload()
          }}>Generate Again</button>
        </div>
      </div> : <></>}

      {blob && metadata ? <div className="border w-fit hidden mx-auto" ref={refWrap}>
        <div ref={ref} className="p-8 flex-col items-center space-y-10 w-fit mx-auto bg-white">
          <div>
            <img src={URL.createObjectURL(blob as Blob)} onLoad={() => setIsReady(true)} className="" alt="Image" />
          </div>
          <div className="text-center font-light text-gray-400 pb-3">
            <p className="text-2xl">
              Shot on <strong className="font-semibold text-black">{metadata?.Model?.description}</strong>
            </p>
            <p className="text-lg mt-1 space-x-2">
              <span>{metadata?.FocalLengthIn35mmFilm?.description}mm</span>
              <span>{metadata?.FNumber?.description}</span>
              <span>{metadata?.ExposureTime?.description}s</span>
              <span>ISO{metadata?.ISOSpeedRatings?.description}</span>
            </p>
          </div>
        </div>
      </div> : <div className="space-y-4 flex items-center flex-col">
        <img src="./Screenshot (1).png" className="max-w-sm w-full border mx-auto" alt="Image" />
        <input type="file" multiple={false} className="file-input w-full max-w-xs" onChange={e => setFiles(e.target.files)} />
      </div>}
    </div>
  </div>
}
