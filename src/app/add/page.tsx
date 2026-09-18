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
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center text-gray-500 py-16">
        Silakan masuk terlebih dahulu.
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
          <PlusCircle size={28} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold gradient-text tracking-tight">
          Catat Pengeluaran
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Tambah transaksi baru ke laporan Anda
        </p>
        <div className="divider mt-6 max-w-xs mx-auto" />
      </div>

      {/* Form */}
      <div className="glass-card p-6 fade-in stagger-2">
        <ExpenseForm userId={userId} />
      </div>
    </div>
  )
}
