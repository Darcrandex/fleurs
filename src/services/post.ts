'use client'

import { http } from '@/utils/http.client'
import { Post, Prisma } from '@prisma/client'

export const postService = {
  getById: async (id: number) => {
    const res = await http.get<Post>(`/api/post/${id}`)
    return res.data
  },

  pages: async (params?: { page?: string; pageSize?: string; keyword?: string; categoryId?: string }) => {
    const res = await http.get<API.PageData<Post>>('/api/post', { params })
    return res.data
  },

  create: async (data: Prisma.PostUncheckedCreateInput) => {
    const res = await http.post<Post>('/api/post', data)
    return res.data
  },

  remove: async (id: number) => {
    const res = await http.delete(`/api/post/${id}`)
    return res.data
  },

  update: async (id: number, data: Prisma.PostUncheckedUpdateInput) => {
    const res = await http.put<Post>(`/api/post/${id}`, data)
    return res.data
  },
}
