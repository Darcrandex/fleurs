'use client'

import { http } from '@/utils/http.client'
import type { HeadBlobResult, PutBlobResult } from '@vercel/blob'

// 目前只支持图片媒体
export const ossService = {
  upload: async (file: File, bucket?: string) => {
    const params = { filename: file.name, bucket }
    const res = await http.post<PutBlobResult>('/api/oss/image', file, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  uploadAsBuffer: async (arrayBuffer: ArrayBuffer, params?: { bucket?: string }) => {
    const res = await http.post<PutBlobResult>('/api/oss/image/buffer', arrayBuffer, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  getMeta: async (url: string) => {
    const res = await http.get<HeadBlobResult>('/api/oss/image', { params: { url } })
    return res.data
  },

  remove: async (url: string) => {
    const res = await http.delete('/api/oss/image', { params: { url } })
    return res.data
  },
}
