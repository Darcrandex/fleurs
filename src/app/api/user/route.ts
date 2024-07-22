import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get users
export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)
  if (user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
