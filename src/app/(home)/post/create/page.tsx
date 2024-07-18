/**
 * @name PostCreate
 * @description
 * @author darcrand
 */

'use client'
import type { PutBlobResult } from '@vercel/blob'
import Image from 'next/image'
import { useRef, useState } from 'react'

export default function PostCreate() {
  const [blob, setBlob] = useState<PutBlobResult>()

  const elRef = useRef<HTMLInputElement>(null)
  const onUpload = async () => {
    if (!elRef.current) return

    const fileObj = elRef.current.files?.[0]
    const res = await fetch(`/api/oss/upload?filename=${fileObj?.name}`, {
      method: 'POST',
      body: fileObj
    })

    const newBlob = (await res.json()) as PutBlobResult
    console.log('newBlob', newBlob)
    setBlob(newBlob)
  }

  return (
    <>
      <h1>PostCreate</h1>

      <input ref={elRef} type='file' name='file' />
      <button onClick={onUpload}>upload</button>

      {!!blob?.url && <Image src={blob?.url} alt='' width={200} height={200} />}
    </>
  )
}
