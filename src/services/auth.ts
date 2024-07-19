'use client'

import { http } from '@/utils/http.client'
import { User } from '@prisma/client'

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await http.post<{ token: string }>('/api/auth/login', data)
    return res.data
  },

  signUp: async (data: Pick<User, 'email' | 'password' | 'nickname' | 'avatar'>) => {
    const res = await http.post('/api/auth/sign', data)
    return res.data
  },

  profile: async () => {
    const res = await http.get<Omit<User, 'password'>>('/api/auth/profile')
    return res.data
  },
}
