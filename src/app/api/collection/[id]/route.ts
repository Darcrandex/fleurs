import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get collection
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const collection = await prisma.collection.findUnique({ where: { id } })
  return NextResponse.json(collection)
}

// update collection
export async function PUT(request: NextRequest) {
  const data = await request.json()

  const updatedCollection = await prisma.collection.update({
    where: { id: data.id },
    data,
  })
  return NextResponse.json(updatedCollection)
}

// delete collection
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const deletedCollection = await prisma.collection.delete({ where: { id } })
  return NextResponse.json(deletedCollection)
}
