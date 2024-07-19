import { Prisma, PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// sign in
export async function POST(request: NextRequest) {
  // password is encrypted
  const { email, password, avatar, nickname } = (await request.json()) as Prisma.UserCreateInput

  const existedUser = await prisma.user.findUnique({ where: { email } })
  if (existedUser) {
    return new NextResponse('User already exists', { status: 400 })
  }

  // 加密登录密码
  const salt = await bcrypt.genSalt()
  const decryptedPassword = CryptoJS.AES.decrypt(password, process.env.AES_ENCRYPT_KEY || '').toString(
    CryptoJS.enc.Utf8,
  )
  const hashedPassword = await bcrypt.hash(decryptedPassword, salt)

  const userCount = await prisma.user.count()
  const newUser = await prisma.user.create({
    // 第一个用户为管理员
    data: { email, password: hashedPassword, avatar, nickname, role: userCount === 0 ? Role.ADMIN : Role.ACCOUNT },
  })

  return NextResponse.json(newUser)
}
