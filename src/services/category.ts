'use client'

import { http } from '@/utils/http.client'
import { Category, Prisma } from '@prisma/client'

export const categoryService = {
  all: async () => {
    const res = await http.get<Array<Category>>('/api/category')
    return res.data
  },

  create: async (data: Pick<Prisma.CategoryCreateInput, 'name'>) => {
    const res = await http.post<Category>('/api/category', data)
    return res.data
  },
}
