import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get user
export async function GET(request: NextRequest) {
  const admin = await getUserFromToken(request)
  if (admin.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const user = await prisma.user.findUnique({ where: { id } })
  return NextResponse.json(user)
}

// update user
export async function PUT(request: NextRequest) {
  const admin = await getUserFromToken(request)
  if (admin.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: data.id },
    data,
  })

  return NextResponse.json(updatedUser)
}

// delete user
export async function DELETE(request: NextRequest) {
  const admin = await getUserFromToken(request)
  if (admin.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const deletedUser = await prisma.user.delete({ where: { id } })
  return NextResponse.json(deletedUser)
}
