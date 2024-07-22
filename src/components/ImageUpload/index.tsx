/**
 * @name ImageUpload
 * @description
 * @author darcrand
 */

'use client'
import { useEffect, useState } from 'react'

export type ImageUploadProps = {
  value?: string | File
  onChange?: (value?: string | File) => void
}

export default function ImageUpload(props: ImageUploadProps) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (typeof props.value === 'string') setUrl(props.value)

    if (Object.prototype.toString.call(props.value) === '[object File]') {
      const fileObj = props.value as File
      const reader = new FileReader()
      reader.onload = () => setUrl(reader.result as string)
      reader.readAsDataURL(fileObj)
    }
  }, [props.value])

  return (
    <>
      <label>
        {url ? <img src={url} alt='' className='block h-48 w-48 object-cover' /> : null}
        <hr />
        <input type='file' accept='image/*' onChange={(e) => props.onChange?.(e.target.files?.[0])} />
      </label>
    </>
  )
}
