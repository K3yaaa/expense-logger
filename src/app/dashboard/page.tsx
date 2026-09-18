'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Expense, Category, CATEGORIES } from '@/types'
import { formatRupiah, getMonthKey, formatMonth } from '@/lib/utils'
import PieChartCategory from '@/components/PieChartCategory'
import BarChartMonthly from '@/components/BarChartMonthly'
import ExpenseList from '@/components/ExpenseList'
import { TrendingUp, Calendar, Receipt, Loader2 } from 'lucide-react'

interface Summary {
  totalMonth: number
  avgDaily: number
  totalCount: number
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setExpenses(data)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const currentMonthKey = getMonthKey(new Date().toISOString())

  // Filter this month's expenses
  const monthExpenses = expenses.filter((e) => getMonthKey(e.created_at) === currentMonthKey)

  // Summary stats
  const summary: Summary = {
    totalMonth: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    avgDaily: monthExpenses.length > 0
      ? monthExpenses.reduce((sum, e) => sum + e.amount, 0) /
        new Date().getDate()
      : 0,
    totalCount: monthExpenses.length,
  }

  // Pie chart data: by category
  const categoryTotals: Record<string, number> = {}
  monthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })
  const pieData = Object.entries(categoryTotals).map(([cat, total]) => ({
    category: cat as Category,
    total,
  }))

  // Bar chart data: last 6 months
  const monthlyTotals: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = getMonthKey(d.toISOString())
    monthlyTotals[key] = 0
  }
  expenses.forEach((e) => {
    const key = getMonthKey(e.created_at)
    if (key in monthlyTotals) {
      monthlyTotals[key] += e.amount
    }
  })
  const barData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month: formatMonth(`${month}-01`),
    total,
  }))

  const recentExpenses = expenses.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Ringkasan pengeluaran Anda
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total Bulan Ini
              </p>
              <p className="text-xl font-bold text-accent">
                {formatRupiah(summary.totalMonth)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Rata-rata Harian
              </p>
              <p className="text-xl font-bold text-white">
                {formatRupiah(Math.round(summary.avgDaily))}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Receipt size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Transaksi Bulan Ini
              </p>
              <p className="text-xl font-bold text-white">
                {summary.totalCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">
            Pengeluaran per Kategori
          </h2>
          <PieChartCategory data={pieData} />
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">
            Tren 6 Bulan Terakhir
          </h2>
          <BarChartMonthly data={barData} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">
          Transaksi Terbaru
        </h2>
        <ExpenseList
          expenses={recentExpenses}
          onDelete={() => {}}
          showReceipt
          emptyMessage="Belum ada transaksi."
        />
      </div>
    </div>
  )
}
