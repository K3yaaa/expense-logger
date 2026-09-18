'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Expense, Category, CATEGORIES, MONTHS } from '@/types'
import { getMonthKey, formatRupiah } from '@/lib/utils'
import ExpenseList from '@/components/ExpenseList'
import { History, Filter, Loader2 } from 'lucide-react'

export default function HistoryPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('')
  const [monthFilter, setMonthFilter] = useState<string>('')
  const router = useRouter()

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

  // Apply filters
  const filteredExpenses = expenses.filter((e) => {
    if (categoryFilter && e.category !== categoryFilter) return false
    if (monthFilter && getMonthKey(e.created_at) !== monthFilter) return false
    return true
  })

  // Build available months from data
  const availableMonths = Array.from(
    new Set(expenses.map((e) => getMonthKey(e.created_at)))
  ).sort().reverse()

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <History size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Riwayat Pengeluaran</h1>
          <p className="text-gray-400 text-sm">
            {filteredExpenses.length} transaksi{' '}
            {filteredExpenses.length > 0 && (
              <span className="text-accent font-medium">
                ({formatRupiah(totalFiltered)})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-gray-500" />
          <h2 className="text-sm font-medium text-gray-300">Filter</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="label">Kategori</label>
            <select
              className="input-field cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | '')}
            >
              <option value="">Semua Kategori</option>
              {Object.entries(CATEGORIES).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.label}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="label">Bulan</label>
            <select
              className="input-field cursor-pointer"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">Semua Bulan</option>
              {availableMonths.map((month) => {
                const [year, monthNum] = month.split('-')
                const label = `${MONTHS[parseInt(monthNum, 10) - 1]} ${year}`
                return (
                  <option key={month} value={month}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(categoryFilter || monthFilter) && (
          <button
            onClick={() => {
              setCategoryFilter('')
              setMonthFilter('')
            }}
            className="mt-3 text-xs text-gray-500 hover:text-accent transition-colors"
          >
            Hapus filter
          </button>
        )}
      </div>

      {/* Expense List */}
      <div className="card">
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
