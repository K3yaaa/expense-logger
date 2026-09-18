'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface NavbarProps {
  userEmail?: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/add', label: 'Tambah Pengeluaran' },
    { href: '/history', label: 'Riwayat' },
  ]

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-accent">ExpenseLog</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-accent transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center gap-3">
            {userEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={14} />
                <span className="max-w-48 truncate">{userEmail}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-dark-600 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-300 hover:text-accent transition-colors text-sm font-medium px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-dark-600 pt-3 px-2">
              {userEmail && (
                <p className="text-xs text-gray-500 mb-2 truncate">{userEmail}</p>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
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
