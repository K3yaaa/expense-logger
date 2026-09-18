'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface NavbarProps {
  userEmail?: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/add', label: 'Catat' },
    { href: '/history', label: 'Riwayat' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'rgba(13,13,43,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
      {/* Animated star dots */}
      <style>{`
        @keyframes star-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .nav-star-1 { animation: star-pulse 2.5s ease-in-out infinite; }
        .nav-star-2 { animation: star-pulse 3.2s ease-in-out infinite 0.8s; }
        .nav-star-3 { animation: star-pulse 4s ease-in-out infinite 1.5s; }
      `}</style>
      <div className="absolute top-3 left-8">
        <span className="nav-star-1 inline-block w-1 h-1 rounded-full bg-yellow-400" style={{ boxShadow: '0 0 6px rgba(255,215,0,0.8)' }} />
      </div>
      <div className="absolute top-5 right-20">
        <span className="nav-star-2 inline-block w-0.5 h-0.5 rounded-full bg-yellow-300" style={{ boxShadow: '0 0 4px rgba(255,215,0,0.6)' }} />
      </div>
      <div className="absolute top-2 right-32">
        <span className="nav-star-3 inline-block w-0.5 h-0.5 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 4px rgba(0,212,255,0.6)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #f0c040 30%, #ffd700 50%, #ffec80 70%, #ffd700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.3))',
              }}
            >
              ExpenseLog
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-amber-300'
                    : 'text-indigo-400/70 hover:text-amber-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center gap-4">
            {userEmail && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(196,167,231,0.6)' }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #ffd700, #f0c040)' }}
                >
                  <User size={13} className="text-gray-900" />
                </div>
                <span className="max-w-40 truncate">{userEmail}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'rgba(196,167,231,0.5)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(196,167,231,0.5)')}
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 transition-colors"
            style={{ color: 'rgba(255,215,0,0.6)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,215,0,0.06)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-amber-300'
                    : 'text-indigo-400/70 hover:text-amber-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,215,0,0.06)' }} className="pt-3 mt-2 px-2">
              {userEmail && (
                <p className="text-xs mb-2 truncate px-1" style={{ color: 'rgba(196,167,231,0.4)' }}>{userEmail}</p>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-sm px-3 py-2.5 rounded-lg transition-colors"
                style={{ color: '#f87171' }}
              >
                <LogOut size={14} />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
