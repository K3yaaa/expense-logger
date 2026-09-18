'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.')
      return
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setLoading(false)
      router.push('/dashboard')
      return
    }

    setSuccess('Cek email untuk konfirmasi, lalu masuk.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glass card */}
      <div
        className="p-8 w-full max-w-md relative z-10 fade-in"
        style={{
          background: 'rgba(13,13,43,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(0,212,255,0.06), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Swirling brushstroke decoration at top */}
        <div style={{ position: 'absolute', top: '-1px', left: '10%', right: '10%', height: '3px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(255,215,0,0.2), rgba(196,167,231,0.3), transparent)', borderRadius: '50%' }} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold mb-2 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #ffd700 40%, #c4a7e7 70%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.3))',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            ExpenseLog
          </h1>
          <p className="text-sm" style={{ color: 'rgba(196,167,231,0.5)' }}>Buat akun baru</p>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Error */}
        {error && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(20,83,45,0.4)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
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
                placeholder="Minimal 6 karakter"
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

          <div>
            <label className="label">Konfirmasi Kata Sandi</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field input-glow"
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
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
                <UserPlus size={18} />
              )}
              {loading ? 'Mendaftar...' : 'Daftar'}
            </span>
          </button>
        </form>

        {/* Login link */}
        <div className="divider mt-8 mb-6" />
        <p className="text-center text-sm" style={{ color: 'rgba(196,167,231,0.5)' }}>
          Sudah punya akun?{' '}
          <Link href="/login" className="link font-medium">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
