import { PrismaClient, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import * as jose from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import * as R from 'ramda'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  // password is encrypted
  const { email, password } = (await request.json()) as Pick<User, 'email' | 'password'>

  const matchedUser = await prisma.user.findUnique({ where: { email } })

  const decryptedPassword = CryptoJS.AES.decrypt(password, process.env.AES_ENCRYPT_KEY || '').toString(
    CryptoJS.enc.Utf8,
  )
  const hashedPassword = matchedUser?.password || ''
  const isValid = await bcrypt.compare(decryptedPassword, hashedPassword)

  if (!matchedUser || !isValid) {
    return new NextResponse('user or password is invalid', { status: 400 })
  }

  const token = await new jose.SignJWT(R.omit(['password'], matchedUser))
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    // 过期时间为 1 天
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || ''))

  return NextResponse.json({ token })
}
