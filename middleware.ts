import { NextResponse, NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if needed and get current session
  const { data: { session } } = await supabase.auth.getSession()

  const url = new URL(req.url)
  const pathname = url.pathname

  // Guard all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}


