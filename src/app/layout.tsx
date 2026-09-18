import type { Metadata } from 'next'
import './globals.css'
import VanGoghBackground from '@/components/VanGoghBackground'

export const metadata: Metadata = {
  title: 'ExpenseLog - Catat Pengeluaran Anda',
  description: 'Aplikasi pencatatan pengeluaran dengan Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <VanGoghBackground />
        <div className="relative z-10">{children}</div>
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  )
}
