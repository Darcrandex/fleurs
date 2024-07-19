import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get tag
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const tag = await prisma.tag.findUnique({ where: { id } })
  return NextResponse.json(tag)
}

// delete tag
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const deletedTag = await prisma.tag.delete({ where: { id } })
  return NextResponse.json(deletedTag)
}
