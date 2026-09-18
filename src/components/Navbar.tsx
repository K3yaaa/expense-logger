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
    <nav className="sticky top-0 z-50 relative" style={{ background: 'rgba(15,14,19,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,169,110,0.06)' }}>
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #c9a96e 0%, #d4a574 40%, #e8d4b8 60%, #c9a96e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Playfair Display, serif',
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
                    ? 'text-[#c9a96e]'
                    : 'text-[rgba(156,142,196,0.5)] hover:text-[rgba(201,169,110,0.7)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center gap-4">
            {userEmail && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(156,142,196,0.5)' }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #c9a96e, #d4a574)' }}
                >
                  <User size={13} className="text-[#1a1510]" />
                </div>
                <span className="max-w-40 truncate">{userEmail}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'rgba(156,142,196,0.4)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(156,142,196,0.4)')}
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 transition-colors"
            style={{ color: 'rgba(201,169,110,0.5)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-1" style={{ borderTop: '1px solid rgba(201,169,110,0.04)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-[#c9a96e]'
                    : 'text-[rgba(156,142,196,0.5)] hover:text-[rgba(201,169,110,0.7)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(201,169,110,0.04)' }} className="pt-3 mt-2 px-2">
              {userEmail && (
                <p className="text-xs mb-2 truncate px-1" style={{ color: 'rgba(156,142,196,0.3)' }}>{userEmail}</p>
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
