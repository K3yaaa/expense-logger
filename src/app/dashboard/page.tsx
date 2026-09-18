'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Expense, Category, CATEGORIES, SOURCES, Source } from '@/types'
import { formatRupiah, getMonthKey, formatMonth } from '@/lib/utils'
import VanGoghPieChart from '@/components/VanGoghPieChart'
import BarChartMonthly from '@/components/BarChartMonthly'
import ExpenseList from '@/components/ExpenseList'
import { TrendingUp, Calendar, Receipt, Loader2, Sparkles } from 'lucide-react'

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

  // Category pie data
  const categoryTotals: Record<string, number> = {}
  monthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })
  const pieData = Object.entries(categoryTotals).map(([cat, total]) => ({
    category: cat as Category,
    total,
  }))

  // Source pie data
  const sourceTotals: Record<string, number> = {}
  monthExpenses.forEach((e) => {
    const src = e.source || 'lain'
    sourceTotals[src] = (sourceTotals[src] || 0) + e.amount
  })
  const sourcePieData = Object.entries(sourceTotals).map(([src, total]) => ({
    label: SOURCES[src as Source]?.label ?? src,
    value: total,
    color: SOURCES[src as Source]?.color ?? '#c4a7e7',
  }))

  // Monthly bar data
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
        <Loader2 size={28} className="spin-slow" style={{ color: '#ffd700' }} />
      </div>
    )
  }

  return (
    <div className="space-y-8 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold van-gogh-text tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          Ringkasan
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(196,167,231,0.5)' }}>
          Gambaran pengeluaran Anda bulan ini
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 summary-card glow-gold fade-in stagger-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.1)' }}>
              <TrendingUp size={18} style={{ color: '#ffd700' }} />
            </div>
            <p className="label mb-0">Total Bulan Ini</p>
          </div>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#f5f0e0' }}>
            {formatRupiah(summary.totalMonth)}
          </p>
        </div>

        <div className="glass-card p-5 summary-card glow-cyan fade-in stagger-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}>
              <Calendar size={18} style={{ color: '#00d4ff' }} />
            </div>
            <p className="label mb-0">Rata-rata Harian</p>
          </div>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#f5f0e0' }}>
            {formatRupiah(Math.round(summary.avgDaily))}
          </p>
        </div>

        <div className="glass-card p-5 summary-card glow-lavender fade-in stagger-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(196,167,231,0.1)' }}>
              <Receipt size={18} style={{ color: '#c4a7e7' }} />
            </div>
            <p className="label mb-0">Transaksi</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#f5f0e0' }}>
            {summary.totalCount}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Pie */}
        <div className="glass-card p-6 fade-in stagger-2">
          <h2 className="text-sm font-semibold mb-5 tracking-wide uppercase" style={{ color: 'rgba(196,167,231,0.7)', fontFamily: 'Playfair Display, serif', letterSpacing: '2px' }}>
            Per Kategori
          </h2>
          <VanGoghPieChart
            data={pieData.map((d) => ({
              label: CATEGORIES[d.category]?.label ?? d.category,
              value: d.total,
              color: CATEGORIES[d.category]?.color ?? '#8b9dc3',
            }))}
          />
        </div>

        {/* Source Pie */}
        <div className="glass-card p-6 fade-in stagger-3">
          <h2 className="text-sm font-semibold mb-5 tracking-wide uppercase" style={{ color: 'rgba(255,215,0,0.7)', fontFamily: 'Playfair Display, serif', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: '#ffd700' }} />
            Per Sumber Dana
          </h2>
          <VanGoghPieChart data={sourcePieData} />
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="glass-card p-6 fade-in stagger-2">
        <h2 className="text-sm font-semibold mb-5 tracking-wide uppercase" style={{ color: 'rgba(196,167,231,0.7)', fontFamily: 'Playfair Display, serif', letterSpacing: '2px' }}>
          Tren 6 Bulan
        </h2>
        <BarChartMonthly data={barData} />
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6 fade-in stagger-4">
        <h2 className="text-sm font-semibold mb-5 tracking-wide uppercase" style={{ color: 'rgba(196,167,231,0.7)', fontFamily: 'Playfair Display, serif', letterSpacing: '2px' }}>
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
