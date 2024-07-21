import { Prisma, PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get all categories
export async function GET(request: NextRequest) {
  const categories = await prisma.category.findMany()
  return NextResponse.json(categories)
}

// create category
export async function POST(request: NextRequest) {
  const data = (await request.json()) as Pick<Prisma.CategoryCreateInput, 'name'>
  const newCategory = await prisma.category.create({ data })

  return NextResponse.json(newCategory)
}
