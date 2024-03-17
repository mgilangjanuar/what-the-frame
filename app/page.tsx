'use client'

import { useToPng } from '@hugocxl/react-to-image'
import * as ExifReader from 'exifreader'
import { Caveat } from 'next/font/google'
import Link from 'next/link'
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

        if (file.name.toLowerCase().endsWith('.heic') && window) {
          const heic2any = (await import('heic2any')).default
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
      if (!window) return
      if (!refWrap.current) return
      refWrap.current.classList.remove('hidden')
      setTimeout(() => convert(), 1500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  return <div className="min-h-svh">
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <a className={`${caveat.className} btn btn-ghost text-3xl`}>What The Frame</a>
      </div>
      <div className="flex-none">
        <Link className="btn btn-square btn-ghost" href="https://github.com/mgilangjanuar/what-the-frame" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
          </svg>
        </Link>
      </div>
    </div>
    <div className="container mx-auto space-y-4 py-6">
      {files && !result ? <p className="text-center">Processing...</p> : <>
        {error ? <p className="text-red-400 text-center">{error}</p> : <></>}
      </>}
      {result ? <div className="space-y-4 flex items-center flex-col">
        <img src={result} className="max-w-sm w-full border" alt="Image" />
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={() => {
            if (!window) return
            window.location.reload()
          }}>Generate Again</button>
          <a href={result} download="shot.png" className="btn btn-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4l0 12" />
            </svg>
          </a>
        </div>
      </div> : <></>}

      {blob && metadata ? <div className="border hidden w-fit mx-auto" ref={refWrap}>
        <div ref={ref} className="p-8 flex-col items-center space-y-10 mx-auto bg-white">
          <div>
            <img src={URL.createObjectURL(blob as Blob)} onLoad={() => setIsReady(true)} className="max-w-2xl" alt="Image" />
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
