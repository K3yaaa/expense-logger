'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Expense, Category, CATEGORIES, SOURCES, Source } from '@/types'
import { getMonthKey, formatRupiah } from '@/lib/utils'
import ExpenseList from '@/components/ExpenseList'
import { History, Filter, Loader2, UtensilsCrossed, Bus, ShoppingBag, Film, MoreHorizontal } from 'lucide-react'

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  makanan: <UtensilsCrossed size={14} />,
  transport: <Bus size={14} />,
  belanja: <ShoppingBag size={14} />,
  hiburan: <Film size={14} />,
  lain: <MoreHorizontal size={14} />,
}

export default function HistoryPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('')
  const [sourceFilter, setSourceFilter] = useState<Source | ''>('')
  const [monthFilter, setMonthFilter] = useState<string>('')

  const fetchExpenses = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setExpenses(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }
  }

  const filteredExpenses = expenses.filter((e) => {
    if (categoryFilter && e.category !== categoryFilter) return false
    if (sourceFilter && e.source !== sourceFilter) return false
    if (monthFilter && getMonthKey(e.created_at) !== monthFilter) return false
    return true
  })

  const availableMonths = Array.from(
    new Set(expenses.map((e) => getMonthKey(e.created_at)))
  ).sort().reverse()

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="spin-slow" style={{ color: '#ffd700' }} />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold van-gogh-text tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          Riwayat
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(196,167,231,0.5)' }}>
          {filteredExpenses.length} transaksi
          {filteredExpenses.length > 0 && (
            <span className="font-medium ml-1" style={{ color: '#ffd700' }}>
              ({formatRupiah(totalFiltered)})
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-5 fade-in stagger-1">
        <div className="flex items-center gap-2 mb-5">
          <Filter size={15} style={{ color: 'rgba(196,167,231,0.5)' }} />
          <h2 className="text-sm font-medium" style={{ color: 'rgba(196,167,231,0.5)' }}>Filter</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="label">Kategori</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <button
                onClick={() => setCategoryFilter('')}
                className={`category-pill ${categoryFilter === '' ? 'selected' : ''}`}
                style={{
                  color: categoryFilter === '' ? 'rgba(245,240,224,0.6)' : 'rgba(245,240,224,0.3)',
                  borderColor: categoryFilter === '' ? 'rgba(245,240,224,0.3)' : 'transparent',
                  backgroundColor: categoryFilter === '' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                Semua
              </button>
              {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                  className="category-pill"
                  style={{
                    color: categoryFilter === cat ? CATEGORIES[cat].color : 'rgba(245,240,224,0.3)',
                    borderColor: categoryFilter === cat ? CATEGORIES[cat].color : 'transparent',
                    backgroundColor: categoryFilter === cat ? `${CATEGORIES[cat].color}15` : 'rgba(255,255,255,0.02)',
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                  {CATEGORIES[cat].label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Filter */}
          <div>
            <label className="label">Sumber Dana</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <button
                onClick={() => setSourceFilter('')}
                className={`category-pill ${sourceFilter === '' ? 'selected' : ''}`}
                style={{
                  color: sourceFilter === '' ? 'rgba(245,240,224,0.6)' : 'rgba(245,240,224,0.3)',
                  borderColor: sourceFilter === '' ? 'rgba(245,240,224,0.3)' : 'transparent',
                  backgroundColor: sourceFilter === '' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                Semua
              </button>
              {(Object.keys(SOURCES) as Source[]).map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(sourceFilter === src ? '' : src)}
                  className="category-pill"
                  style={{
                    color: sourceFilter === src ? SOURCES[src].color : 'rgba(245,240,224,0.3)',
                    borderColor: sourceFilter === src ? SOURCES[src].color : 'transparent',
                    backgroundColor: sourceFilter === src ? SOURCES[src].bg : 'rgba(255,255,255,0.02)',
                  }}
                >
                  {SOURCES[src].label}
                </button>
              ))}
            </div>
          </div>

          {/* Month Filter */}
          <div>
            <label className="label">Bulan</label>
            <select
              className="input-field input-glow mt-1.5 cursor-pointer"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">Semua Bulan</option>
              {availableMonths.map((month) => {
                const [year, monthNum] = month.split('-')
                const label = `${['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][parseInt(monthNum, 10) - 1]} ${year}`
                return (
                  <option key={month} value={month}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {(categoryFilter || sourceFilter || monthFilter) && (
          <button
            onClick={() => {
              setCategoryFilter('')
              setSourceFilter('')
              setMonthFilter('')
            }}
            className="mt-4 text-xs transition-colors"
            style={{ color: 'rgba(196,167,231,0.4)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(196,167,231,0.4)')}
          >
            Hapus filter
          </button>
        )}
      </div>

      {/* Expense List */}
      <div className="glass-card p-5 fade-in stagger-2">
        <div className="flex items-center gap-2 mb-5">
          <History size={15} style={{ color: 'rgba(196,167,231,0.5)' }} />
          <h2 className="text-sm font-medium" style={{ color: 'rgba(196,167,231,0.5)' }}>Transaksi</h2>
        </div>
        <ExpenseList
          expenses={filteredExpenses}
          onDelete={handleDelete}
          showReceipt
          emptyMessage={
            categoryFilter || sourceFilter || monthFilter
              ? 'Tidak ada transaksi yang cocok dengan filter.'
              : 'Belum ada pengeluaran yang tercatat.'
          }
        />
      </div>
    </div>
  )
}
