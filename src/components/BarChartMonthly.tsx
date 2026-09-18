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
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={{ stroke: '#333' }}
          tickLine={{ stroke: '#333' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={{ stroke: '#333' }}
          tickLine={{ stroke: '#333' }}
          tickFormatter={(value) => {
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
            if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
            return value
          }}
        />
        <Tooltip
          formatter={(value: number) => [formatRupiah(value), 'Total']}
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#e5e5e5',
          }}
          cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
        />
        <Bar
          dataKey="total"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
