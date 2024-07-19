import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const user = await prisma.user.findUnique({ where: { id } })
  return NextResponse.json(user)
}

// update user
export async function PUT(request: NextRequest) {
  const data = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: data.id },
    data,
  })

  return NextResponse.json(updatedUser)
}

// delete user
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const deletedUser = await prisma.user.delete({ where: { id } })
  return NextResponse.json(deletedUser)
}
