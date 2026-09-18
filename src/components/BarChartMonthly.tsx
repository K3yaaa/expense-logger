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
      <div className="flex items-center justify-center h-64 text-gray-600 text-sm">
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
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
            backgroundColor: 'rgba(17, 17, 17, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            color: '#d4d4d4',
            fontSize: '13px',
            backdropFilter: 'blur(8px)',
          }}
          cursor={{ fill: 'rgba(34, 197, 94, 0.06)' }}
        />
        <Bar
          dataKey="total"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
