'use client'

import { http } from '@/utils/http.client'
import { Article, Prisma } from '@prisma/client'

export const articelService = {
  pages: async (params?: { page?: string; pageSize?: string; keyword?: string }) => {
    const res = await http.get<{ records: Article[]; total: number; page: number; pageSize: number }>('/api/article', {
      params,
    })
    return res.data
  },

  getById: async (id: number) => {
    const res = await http.get<Article>(`/api/article/${id}`)
    return res.data
  },

  create: async (
    data: Pick<Article, 'title' | 'content' | 'coverUrl' | 'coverWidth' | 'coverHeight' | 'aspectRatio'>,
  ) => {
    const res = await http.post<Article>('/api/article', data)
    return res.data
  },

  update: async (data: Prisma.ArticleUncheckedUpdateInput) => {
    const res = await http.put<Article>(`/api/article/${data.id}`, data)
    return res.data
  },

  remove: async (id: number) => {
    const res = await http.delete(`/api/article/${id}`)
    return res.data
  },
}
