'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email atau kata sandi salah.'
        : error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">ExpenseLog</h1>
          <p className="text-gray-400 text-sm">Masuk ke akun Anda</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="anda@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="link font-medium">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
