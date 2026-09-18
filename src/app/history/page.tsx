'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Expense, Category, CATEGORIES } from '@/types'
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
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold gradient-text tracking-tight">
          Riwayat
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {filteredExpenses.length} transaksi
          {filteredExpenses.length > 0 && (
            <span className="text-accent font-medium ml-1">
              ({formatRupiah(totalFiltered)})
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-5 fade-in stagger-1">
        <div className="flex items-center gap-2 mb-5">
          <Filter size={15} className="text-gray-500" />
          <h2 className="text-sm font-medium text-gray-400">Filter</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="label">Kategori</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <button
                onClick={() => setCategoryFilter('')}
                className={`category-pill ${categoryFilter === '' ? 'selected' : ''}`}
                style={{ color: '#9ca3af', borderColor: categoryFilter === '' ? '#9ca3af' : 'transparent', backgroundColor: categoryFilter === '' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)' }}
              >
                Semua
              </button>
              {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                  className="category-pill"
                  style={{
                    color: CATEGORIES[cat].color,
                    borderColor: categoryFilter === cat ? CATEGORIES[cat].color : 'transparent',
                    backgroundColor: categoryFilter === cat ? `${CATEGORIES[cat].color}15` : 'rgba(255,255,255,0.03)',
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                  {CATEGORIES[cat].label}
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

        {(categoryFilter || monthFilter) && (
          <button
            onClick={() => {
              setCategoryFilter('')
              setMonthFilter('')
            }}
            className="mt-4 text-xs text-gray-500 hover:text-accent transition-colors"
          >
            Hapus filter
          </button>
        )}
      </div>

      {/* Expense List */}
      <div className="glass-card p-5 fade-in stagger-2">
        <div className="flex items-center gap-2 mb-5">
          <History size={15} className="text-gray-500" />
          <h2 className="text-sm font-medium text-gray-400">Transaksi</h2>
        </div>
        <ExpenseList
          expenses={filteredExpenses}
          onDelete={handleDelete}
          showReceipt
          emptyMessage={
            categoryFilter || monthFilter
              ? 'Tidak ada transaksi yang cocok dengan filter.'
              : 'Belum ada pengeluaran yang tercatat.'
          }
        />
      </div>
    </div>
  )
}
