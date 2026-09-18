'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Expense, Category } from '@/types'
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

  const monthExpenses = expenses.filter((e) => getMonthKey(e.created_at) === currentMonthKey)

  const summary: Summary = {
    totalMonth: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    avgDaily: monthExpenses.length > 0
      ? monthExpenses.reduce((sum, e) => sum + e.amount, 0) /
        new Date().getDate()
      : 0,
    totalCount: monthExpenses.length,
  }

  const categoryTotals: Record<string, number> = {}
  monthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })
  const pieData = Object.entries(categoryTotals).map(([cat, total]) => ({
    category: cat as Category,
    total,
  }))

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
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold gradient-text tracking-tight">
          Ringkasan
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gambaran pengeluaran Anda bulan ini
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 summary-card glow-accent-subtle fade-in stagger-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <TrendingUp size={18} className="text-accent" />
            </div>
            <p className="label mb-0">Total Bulan Ini</p>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {formatRupiah(summary.totalMonth)}
          </p>
        </div>

        <div className="glass-card p-5 summary-card fade-in stagger-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Calendar size={18} className="text-blue-400" />
            </div>
            <p className="label mb-0">Rata-rata Harian</p>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {formatRupiah(Math.round(summary.avgDaily))}
          </p>
        </div>

        <div className="glass-card p-5 summary-card fade-in stagger-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Receipt size={18} className="text-purple-400" />
            </div>
            <p className="label mb-0">Transaksi</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {summary.totalCount}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-6 fade-in stagger-2">
          <h2 className="text-sm font-semibold text-gray-300 mb-5 tracking-wide uppercase">
            Per Kategori
          </h2>
          <PieChartCategory data={pieData} />
        </div>

        <div className="glass-card p-6 fade-in stagger-3">
          <h2 className="text-sm font-semibold text-gray-300 mb-5 tracking-wide uppercase">
            Tren 6 Bulan
          </h2>
          <BarChartMonthly data={barData} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6 fade-in stagger-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-5 tracking-wide uppercase">
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
