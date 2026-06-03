import { NextRequest, NextResponse } from 'next/server'

const MOBILE_RE = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export function proxy(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''
  if (MOBILE_RE.test(ua) && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/mobile', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/' }
