import { Prisma, PrismaClient, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create user
export async function POST(request: NextRequest) {
  const isAdmin = true

  const data = (await request.json()) as Prisma.UserCreateInput
  const newUser = await prisma.user.create({ data: { ...data, role: isAdmin ? Role.ADMIN : Role.ACCOUNT } })
  return NextResponse.json({ user: newUser })
}

// get users
export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
