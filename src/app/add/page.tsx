'use client'

import { PlusCircle } from 'lucide-react'
import ExpenseForm from '@/components/ExpenseForm'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AddPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="spin-slow" style={{ color: '#c9a96e' }} />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center py-16" style={{ color: 'rgba(156,142,196,0.45)' }}>
        Silakan masuk terlebih dahulu.
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.12)' }}>
          <PlusCircle size={28} style={{ color: '#c9a96e' }} />
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #c9a96e 0%, #d4a574 40%, #e8d4b8 60%, #c9a96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Playfair Display, serif',
          }}
        >
          Catat Pengeluaran
        </h1>
        <p className="text-sm mt-2" style={{ color: 'rgba(156,142,196,0.45)' }}>
          Tambah transaksi baru ke laporan Anda
        </p>
        {/* Elegant divider */}
        <div className="mt-6 flex justify-center">
          <div style={{ width: '200px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.15), rgba(156,142,196,0.12), rgba(201,169,110,0.15), transparent)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '8px', color: 'rgba(201,169,110,0.25)' }}>✦</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 fade-in stagger-2">
        <ExpenseForm userId={userId} />
      </div>
    </div>
  )
}
