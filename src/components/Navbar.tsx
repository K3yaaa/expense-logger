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
    <nav className="sticky top-0 z-50 border-b border-white/[0.04]">
      <div className="absolute inset-0 bg-dark-800/80 backdrop-blur-xl border-b border-white/[0.04]" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text tracking-tight">
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
                    ? 'text-accent'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center gap-4">
            {userEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center">
                  <User size={13} className="text-dark-900" />
                </div>
                <span className="max-w-40 truncate">{userEmail}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.04] py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-accent bg-accent/5'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.04] pt-3 mt-2 px-2">
              {userEmail && (
                <p className="text-xs text-gray-600 mb-2 truncate px-1">{userEmail}</p>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-2.5 rounded-lg hover:bg-red-950/20"
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
