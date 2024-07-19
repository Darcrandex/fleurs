import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)

  return NextResponse.json(user)
}
