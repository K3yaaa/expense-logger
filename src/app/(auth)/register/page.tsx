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

    console.log('Signup response:', { error, data })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess('Akun berhasil dibuat! Mengarahkan ke halaman login...')
    setLoading(false)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">ExpenseLog</h1>
          <p className="text-gray-400 text-sm">Buat akun baru</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 rounded-lg px-4 py-3 mb-5 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder="Minimal 6 karakter"
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

          <div>
            <label className="label">Konfirmasi Kata Sandi</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="link font-medium">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
