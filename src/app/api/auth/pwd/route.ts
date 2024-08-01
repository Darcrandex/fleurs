import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import { NextRequest, NextResponse } from 'next/server'
import * as R from 'ramda'

const prisma = new PrismaClient()

// 更新用户密码
export async function PUT(request: NextRequest) {
  const data = (await request.json()) as { oldPassword: string; newPassword: string }

  const opwd = CryptoJS.AES.decrypt(data.oldPassword, process.env.AES_ENCRYPT_KEY || '').toString(CryptoJS.enc.Utf8)
  const npwd = CryptoJS.AES.decrypt(data.newPassword, process.env.AES_ENCRYPT_KEY || '').toString(CryptoJS.enc.Utf8)

  const user = await getUserFromToken(request)
  const matchedUser = await prisma.user.findUnique({ where: { id: user.id } })

  const isValid = await bcrypt.compare(opwd, matchedUser?.password || '')

  console.log('pwd', { opwd, npwd, isValid })

  if (!isValid) {
    return new NextResponse('old password is invalid', { status: 400 })
  }

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(npwd, salt)

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  return NextResponse.json(R.omit(['password'], updatedUser))
}
