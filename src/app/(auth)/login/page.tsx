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
    <div className="min-h-screen ambient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating ambient shapes */}
      <div
        className="floating-shape w-96 h-96 bg-accent"
        style={{ top: '10%', left: '5%', animationDelay: '0s' }}
        aria-hidden="true"
      />
      <div
        className="floating-shape w-64 h-64 bg-emerald-400"
        style={{ bottom: '15%', right: '10%', animationDelay: '-7s' }}
        aria-hidden="true"
      />
      <div
        className="floating-shape w-48 h-48 bg-teal-500"
        style={{ top: '60%', left: '70%', animationDelay: '-14s' }}
        aria-hidden="true"
      />

      {/* Glass card */}
      <div className="glass-card p-8 w-full max-w-md relative z-10 fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold gradient-text mb-2 tracking-tight">
            ExpenseLog
          </h1>
          <p className="text-gray-500 text-sm">Masuk ke akun Anda</p>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-field input-glow"
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
                className="input-field input-glow pr-10"
                placeholder="Kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 relative overflow-hidden rounded-xl py-3.5 font-semibold text-dark-900 transition-all duration-200 btn-press disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-accent to-emerald-400 hover:from-emerald-400 hover:to-accent group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 size={18} className="spin-slow" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? 'Masuk...' : 'Masuk'}
            </span>
          </button>
        </form>

        {/* Register link */}
        <div className="divider mt-8 mb-6" />
        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link href="/register" className="link font-medium hover:text-accent transition-colors">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
