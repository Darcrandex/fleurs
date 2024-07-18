import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create post
export async function POST(request: NextRequest) {
  const newPost = await prisma.post.create({
    data: {
      title: 'Post title',
      content: 'Post content',
    },
  })
  return NextResponse.json({ post: newPost })
}
