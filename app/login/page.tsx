"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

function LoginFormInner() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already logged in, go straight to redirect
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirect)
    })
  }, [redirect, router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.replace(redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full border rounded px-3 py-2" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </div>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  )
}


