import { Prisma, PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create tag
export async function POST(request: NextRequest) {
  const data = (await request.json()) as Prisma.TagCreateInput
  const newTag = await prisma.tag.create({ data })

  return NextResponse.json(newTag)
}

// get tags
export async function GET() {
  const tags = await prisma.tag.findMany()
  return NextResponse.json(tags)
}
