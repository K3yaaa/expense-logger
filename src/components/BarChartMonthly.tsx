'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatRupiah } from '@/lib/utils'

interface BarChartMonthlyProps {
  data: { month: string; total: number }[]
}

export default function BarChartMonthly({ data }: BarChartMonthlyProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'rgba(196,167,231,0.3)' }}>
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.06)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'rgba(196,167,231,0.5)' }}
          axisLine={{ stroke: 'rgba(255,215,0,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'rgba(196,167,231,0.5)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => {
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
            if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
            return value
          }}
        />
        <Tooltip
          formatter={(value: number) => [formatRupiah(value), 'Total']}
          contentStyle={{
            backgroundColor: 'rgba(13,13,43,0.95)',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: '12px',
            color: '#f5f0e0',
            fontSize: '13px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
          cursor={{ fill: 'rgba(255,215,0,0.04)' }}
        />
        <Bar
          dataKey="total"
          fill="url(#goldGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd700" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#b8860b" stopOpacity={0.7} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
