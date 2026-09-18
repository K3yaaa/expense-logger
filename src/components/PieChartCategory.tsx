'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CATEGORIES, Category } from '@/types'

interface PieChartCategoryProps {
  data: { category: Category; total: number }[]
}

const COLORS: Record<Category, string> = {
  makanan: '#f59e0b',
  transport: '#3b82f6',
  belanja: '#8b5cf6',
  hiburan: '#ec4899',
  lain: '#6b7280',
}

export default function PieChartCategory({ data }: PieChartCategoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: CATEGORIES[item.category]?.label ?? item.category,
    value: item.total,
    color: COLORS[item.category] ?? '#6b7280',
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(value)
          }
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#e5e5e5',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
