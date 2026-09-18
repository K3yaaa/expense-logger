'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
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
      <div className="flex items-center justify-center h-64 text-gray-600 text-sm">
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
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
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
            backgroundColor: 'rgba(17, 17, 17, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            color: '#d4d4d4',
            fontSize: '13px',
            backdropFilter: 'blur(8px)',
          }}
          itemStyle={{ color: '#d4d4d4' }}
        />
        {/* Center label */}
        <Pie
          data={[{ name: '', value: chartData.reduce((s, d) => s + d.value, 0) }]}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={0}
          dataKey="value"
        >
          <Cell fill="transparent" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
