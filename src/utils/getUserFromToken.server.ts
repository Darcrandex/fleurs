'use server'
import { User } from '@prisma/client'
import * as jose from 'jose'
import { NextRequest } from 'next/server'

export async function getUserFromToken(request: NextRequest) {
  const tokenInHeader = request.headers.get('Authorization')
  const token = tokenInHeader?.replace('Bearer ', '')
  const user = jose.decodeJwt(token || '') as Omit<User, 'password'>
  if (!user?.id) {
    throw new Error('Invalid user')
  }

  return user
}
