'use client'

import { http } from '@/utils/http.client'
import { Tag } from '@prisma/client'

export const tagService = {
  all: async () => {
    const res = await http.get<Tag[]>('/api/tag')
    return res.data
  },

  create: async (data: Pick<Tag, 'name'>) => {
    const res = await http.post<Tag>('/api/tag', data)
    return res.data
  },
}
