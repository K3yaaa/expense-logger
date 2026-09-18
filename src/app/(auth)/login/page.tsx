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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glass card — warm dark tones */}
      <div
        className="p-8 w-full max-w-md relative z-10 fade-in"
        style={{
          background: 'rgba(18,17,24,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,169,110,0.1)',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(201,169,110,0.04), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Elegant top accent line */}
        <div style={{ position: 'absolute', top: '-1px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.25), rgba(156,142,196,0.15), rgba(201,169,110,0.25), transparent)', borderRadius: '50%' }} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold mb-2 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #c9a96e 0%, #d4a574 40%, #e8d4b8 60%, #c9a96e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            ExpenseLog
          </h1>
          <p className="text-sm" style={{ color: 'rgba(156,142,196,0.45)' }}>Masuk ke akun Anda</p>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Error */}
        {error && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(127,29,29,0.35)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5' }}>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(156,142,196,0.35)' }}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(156,142,196,0.35)')}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 relative overflow-hidden rounded-xl py-3.5 font-semibold transition-all duration-200 btn-press disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #c9a96e 0%, #d4a574 50%, #c9a96e 100%)',
              backgroundSize: '200% 200%',
              color: '#1a1510',
              boxShadow: '0 0 25px rgba(201,169,110,0.2), 0 4px 20px rgba(0,0,0,0.3)',
            }}
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
        <p className="text-center text-sm" style={{ color: 'rgba(156,142,196,0.45)' }}>
          Belum punya akun?{' '}
          <Link href="/register" className="link font-medium">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
