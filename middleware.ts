import { NextResponse, NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if needed and get current session
  const { data: { session } } = await supabase.auth.getSession()

  const url = new URL(req.url)
  const pathname = url.pathname

  // Guard all /admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      // Redirect to admin login instead of regular login
      const redirectUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in, check if they're a manager
    if (session.user) {
      // Special bypass for mabdulaharshad@gmail.com
      if (session.user.email === 'mabdulaharshad@gmail.com') {
        // Allow access without checking managers table
        return res
      }
      
      try {
        const { data: managerData, error } = await supabase
          .from('managers')
          .select('id, role, is_active')
          .eq('email', session.user.email)
          .eq('is_active', true)
          .single()

        // If user is not a manager or inactive, redirect to admin login
        if (error || !managerData) {
          const redirectUrl = new URL('/admin/login', req.url)
          return NextResponse.redirect(redirectUrl)
        }
      } catch (error) {
        // If there's an error checking manager status, redirect to admin login
        const redirectUrl = new URL('/admin/login', req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}


