import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// delete category
export async function DELETE(request: NextRequest, ctx: { params: { id: string } }) {
  const admin = await getUserFromToken(request)
  if (admin.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = Number(ctx.params.id)
  const removedCategory = await prisma.category.delete({ where: { id } })
  return NextResponse.json(removedCategory)
}
