import { Prisma, PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create collection folder
export async function POST(request: NextRequest) {
  const data = (await request.json()) as Prisma.CollectionCreateInput
  const newCollection = await prisma.collection.create({ data })

  return NextResponse.json(newCollection)
}
