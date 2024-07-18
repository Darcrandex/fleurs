import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create user
export async function POST(request: NextRequest) {
  const newUser = await prisma.user.create({
    data: {
      name: 'Elliott',
      email: 'xelliottx@example-user.com',
      image: 'something'
    }
  })

  return NextResponse.json({ user: newUser })
}

// update user
export async function PUT(request: NextRequest) {
  const user = await prisma.user.findFirst()
  if (!user) {
    return
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      name: 'Elliott',
      email: 'xelliottx@example-user.com',
      image: 'something'
    }
  })
  return NextResponse.json({ user: updatedUser })
}

// delete user
export async function DELETE() {
  const user = await prisma.user.findFirst()
  if (!user) {
    return
  }
  await prisma.user.delete({
    where: {
      id: user.id
    }
  })
}

// get users
export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
