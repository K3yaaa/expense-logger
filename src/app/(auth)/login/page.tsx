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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 50% -10%, #1a1a4e 0%, transparent 55%),
          radial-gradient(ellipse 80% 60% at 80% 80%, rgba(45,74,140,0.3) 0%, transparent 50%),
          radial-gradient(ellipse 60% 50% at 20% 70%, rgba(0,212,255,0.08) 0%, transparent 45%),
          radial-gradient(ellipse 40% 30% at 70% 20%, rgba(255,215,0,0.05) 0%, transparent 40%),
          #0a0a0a
        `,
      }}
    >
      {/* Scattered gold stars */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[
          { x: '8%', y: '10%', s: 2.5, delay: '0s' },
          { x: '88%', y: '8%', s: 2, delay: '0.4s' },
          { x: '50%', y: '5%', s: 1.8, delay: '0.8s' },
          { x: '75%', y: '15%', s: 1.5, delay: '1.2s' },
          { x: '25%', y: '20%', s: 2, delay: '1.6s' },
          { x: '92%', y: '30%', s: 1.2, delay: '2s' },
          { x: '5%', y: '40%', s: 1.8, delay: '0.3s' },
          { x: '60%', y: '3%', s: 1.5, delay: '1s' },
          { x: '15%', y: '55%', s: 1.2, delay: '1.4s' },
          { x: '85%', y: '45%', s: 2, delay: '0.6s' },
          { x: '45%', y: '2%', s: 1, delay: '2.2s' },
        ].map((star, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: `${star.s}px`,
              height: `${star.s}px`,
              borderRadius: '50%',
              background: '#ffd700',
              boxShadow: `0 0 ${star.s * 2}px rgba(255,215,0,0.8)`,
              animation: `star-twinkle 3s ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Glass card */}
      <div
        className="p-8 w-full max-w-md relative z-10 fade-in"
        style={{
          background: 'rgba(13,13,43,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,215,0,0.12)',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(255,215,0,0.06), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Swirling brushstroke decoration at top */}
        <div style={{ position: 'absolute', top: '-1px', left: '10%', right: '10%', height: '3px', background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), rgba(0,212,255,0.2), rgba(196,167,231,0.3), transparent)', borderRadius: '50%' }} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold mb-2 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #f0c040 30%, #ffd700 50%, #ffec80 70%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.3))',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            ExpenseLog
          </h1>
          <p className="text-sm" style={{ color: 'rgba(196,167,231,0.5)' }}>Masuk ke akun Anda</p>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Error */}
        {error && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
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
                style={{ color: 'rgba(196,167,231,0.4)' }}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(196,167,231,0.4)')}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 relative overflow-hidden rounded-xl py-3.5 font-semibold text-gray-900 transition-all duration-200 btn-press disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #f0c040 50%, #ffd700 100%)',
              backgroundSize: '200% 200%',
              boxShadow: '0 0 30px rgba(255,215,0,0.3), 0 4px 20px rgba(0,0,0,0.3)',
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
        <p className="text-center text-sm" style={{ color: 'rgba(196,167,231,0.5)' }}>
          Belum punya akun?{' '}
          <Link href="/register" className="link font-medium">
            Daftar di sini
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
