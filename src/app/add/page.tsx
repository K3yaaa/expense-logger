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
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center text-gray-400 py-12">
        Silakan masuk terlebih dahulu.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <PlusCircle size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Pengeluaran</h1>
          <p className="text-gray-400 text-sm">Catat pengeluaran baru Anda</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <ExpenseForm userId={userId} />
      </div>
    </div>
  )
}
