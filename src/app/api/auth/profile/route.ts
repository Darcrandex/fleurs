import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { Prisma, PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import * as R from 'ramda'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)

  return NextResponse.json(user)
}

// update profile
export async function PUT(request: NextRequest) {
  const data = (await request.json()) as Pick<Prisma.UserUpdateInput, 'name' | 'avatar'>
  const user = await getUserFromToken(request)
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: R.pick(['name', 'avatar'], data),
  })

  return NextResponse.json(updatedUser)
}
