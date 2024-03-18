'use client'

import * as ExifReader from 'exifreader'
import { domToPng } from 'modern-screenshot'
import { Caveat } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { PhotoAlbum } from 'react-photo-album'

const caveat = Caveat({ subsets: ['latin'] })

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<ExifReader.Tags | null>(null)
  const refWrap = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (files) {
      (async () => {
        const file = files[0]
        const tags = await ExifReader.load(file)
        setMetadata(tags)
        console.log(tags)

        ;(window as any)['app-dialog'].showModal()
      })()
    }
  }, [files])

  useEffect(() => {
    if (isReady) {
      if (!window) return
      if (!refWrap.current) return
      refWrap.current.classList.remove('hidden')

      ;(async () => {
        let dataUrl = await domToPng(document.querySelector('#main')!)
        dataUrl = await domToPng(document.querySelector('#main')!)
        dataUrl = await domToPng(document.querySelector('#main')!)

        setResult(dataUrl)
        if (!refWrap.current) return
        refWrap.current.classList.add('hidden')

        ;(window as any)['app-loading'].close()
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  return <div>
    <div className="min-h-svh relative">
      <div className="navbar bg-base-100 shadow-xl">
        <div className="flex-1">
          <a className={`${caveat.className} btn btn-ghost text-3xl`}>What the Frame</a>
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
      <div className="container mx-auto space-y-4 py-8">
        {blob && !result ? <p className="text-center">Processing...</p> : <></>}
        {result ? <div className="space-y-4 flex items-center flex-col">
          <img src={result} className="max-w-md w-full border" alt="Image" />
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
          <div className="container mx-auto pt-28 space-y-7">
            <div className="divider"></div>
            <h2 className={`${caveat.className} text-3xl text-center`}>
              Thank you for using our service!
            </h2>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Link className="btn btn-outline" href="https://invoice.xendit.co/donation/9SPxLQ490k" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
                  <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
                  <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
                  <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
                  <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
                </svg>
                Donate (IDR)
              </Link>
              <Link className="btn btn-outline" href="https://github.com/sponsors/mgilangjanuar?frequency=one-time&sponsor=mgilangjanuar" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                </svg>
                Sponsor (USD)
              </Link>
            </div>
          </div>
        </div> : <></>}

        {blob && metadata ? <div className="overflow-auto w-full">
          <div className="border hidden w-fit mx-auto" ref={refWrap}>
            <div id="main" className="p-10 flex-col items-center space-y-20 mx-auto bg-white">
              <div>
                <img src={URL.createObjectURL(blob as Blob)} onLoad={() => setIsReady(true)} className="max-w-7xl" alt="Image" />
              </div>
              <div className="text-center text-gray-400 pb-16">
                {metadata?.Model?.description || metadata?.['Device Manufacturer']?.description ? <p className="text-4xl">
                  Shot on <strong className="font-semibold text-black">{metadata?.Model?.description || metadata?.['Device Manufacturer']?.description}</strong>
                </p> : <></>}
                <p className="text-3xl mt-5 space-x-4">
                  {metadata?.FocalLengthIn35mmFilm?.description && metadata?.FocalLengthIn35mmFilm?.description.toLowerCase() !== 'unknown' ? <span>{metadata?.FocalLengthIn35mmFilm?.description}mm</span> : <></>}
                  {metadata?.FNumber?.description ? <span>{metadata?.FNumber?.description}</span> : <></>}
                  {metadata?.ExposureTime?.description ? <span>{metadata?.ExposureTime?.description}s</span> : <></>}
                  {metadata?.ISOSpeedRatings?.description ? <span>ISO{metadata?.ISOSpeedRatings?.description}</span> : <></>}
                </p>
              </div>
            </div>
          </div>
        </div> : <div className="relative box md:mt-16">
          {/* <img src="./Screenshot (1).png" className="max-w-md w-full border mx-auto" alt="Image" /> */}
          <PhotoAlbum layout="columns" photos={[
            {
              src: "./Screenshot (1).png",
              width: 1472,
              height: 2152,
            },
            {
              src: "./Download (3).png",
              width: 1472,
              height: 2748,
            },
            {
              src: "./Basboi fan.png",
              width: 736,
              height: 688,
            },
            {
              src: "./Gunturr Prewed.jpeg",
              width: 736,
              height: 628,
            },
            {
              src: "./Lang on X (1).jpeg",
              width: 1472,
              height: 2152,
            },
            {
              src: "./Lang on X.jpeg",
              width: 736,
              height: 1374,
            },
            {
              src: "./Lang tweet photo.jpeg",
              width: 736,
              height: 558,
            },
            {
              src: "./Lang.jpeg",
              width: 736,
              height: 628,
            },
            {
              src: "./Screenshot (14).png",
              width: 1360,
              height: 1040,
            },
            {
              src: "./Screenshot (11).png",
              width: 1360,
              height: 1173,
            },
            {
              src: "./Lang Twitter Post.jpeg",
              width: 736,
              height: 1380,
            },
            {
              src: "./Screenshot (15).png",
              width: 1360,
              height: 2026,
            }
          ]} />
          <div className="flex justify-center pt-56 pb-36 bg-gradient-to-b from-base-100/0 via-base-100/100 to-base-100 -mt-64 z-40 absolute w-full">
            <div className="w-fit animate-gradient rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 pb-0.5 pl-0.5">
              <input type="file" multiple={false} className="file-input w-full max-w-xs" onChange={e => setFiles(e.target.files)} accept="image/*,.heic" />
            </div>
          </div>
        </div>}
      </div>

      <dialog id="app-dialog" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Edit</h3>
          <form className="space-y-3 py-3" onSubmit={async e => {
            e.preventDefault()
            const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
            const metadata = {
              Model: { description: data.device },
              FocalLengthIn35mmFilm: { description: data.focal },
              FNumber: { description: data.fnumber },
              ExposureTime: { description: data.exposure },
              ISOSpeedRatings: { description: data.iso },
            }
            setMetadata(metadata as ExifReader.Tags)

            setLoading(true)

            const file = files?.[0]
            if (!file) return
            if (file.name.toLowerCase().endsWith('.heic')) {
              const heic2any = (await import('heic2any')).default
              const blob = await heic2any({ blob: file })
              setBlob(blob as Blob)
            } else {
              const blob = new Blob([file], { type: file.type })
              setBlob(blob)
            }
            setLoading(false)
            ;(window as any)['app-loading'].showModal()
            ;(window as any)['app-dialog'].close()
          }}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Device</span>
              </label>
              <input type="text" name="device" className="input input-bordered" defaultValue={metadata?.Model?.description || metadata?.['Device Manufacturer']?.description} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Focal Length</span>
              </label>
              <input type="text" name="focal" className="input input-bordered" defaultValue={metadata?.FocalLengthIn35mmFilm?.description} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">F Number</span>
              </label>
              <input type="text" name="fnumber" className="input input-bordered" defaultValue={metadata?.FNumber?.description} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Exposure Time</span>
              </label>
              <input type="text" name="exposure" className="input input-bordered" defaultValue={metadata?.ExposureTime?.description} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">ISO</span>
              </label>
              <input type="text" name="iso" className="input input-bordered" defaultValue={metadata?.ISOSpeedRatings?.description} />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-neutral" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : <></>}
                Continue
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="app-loading" className="modal modal-bottom sm:modal-middle z-10">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center gap-5 justify-between">
            Processing...
            <span className="loading loading-dots"></span>
          </h3>
          <p>
            Please wait while we process your image.
          </p>
        </div>
        <form method="dialog" className="modal-backdrop bg-base-200">
          {/* <button>close</button> */}
        </form>
      </dialog>
    </div>
    <div className="flex justify-center items-center py-8 flex-col mt-8 gap-2">
      <div className="divider"></div>
      <div className="container mx-auto">
        <div className="flex gap-3 justify-between items-center w-full flex-wrap">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} What the Frame
          </p>
          <p className="text-sm text-gray-500 flex gap-5">
            <Link className="link" href="/terms">Terms of Service</Link>
            <Link className="link" href="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  </div>
}
