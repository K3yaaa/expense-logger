'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CATEGORIES, Category } from '@/types'

interface PieChartCategoryProps {
  data: { category: Category; total: number }[]
}

const COLORS: Record<Category, string> = {
  makanan: '#c9a96e',
  transport: '#9c8ec4',
  belanja: '#d4a574',
  hiburan: '#b4a88c',
  lain: '#8d9eb8',
}

export default function PieChartCategory({ data }: PieChartCategoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'rgba(156,142,196,0.25)' }}>
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: CATEGORIES[item.category]?.label ?? item.category,
    value: item.total,
    color: COLORS[item.category] ?? '#8d9eb8',
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
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              style={{ filter: `drop-shadow(0 0 5px ${entry.color}30)` }}
            />
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
            backgroundColor: 'rgba(18,17,24,0.95)',
            border: '1px solid rgba(201,169,110,0.12)',
            borderRadius: '12px',
            color: '#f5f0e0',
            fontSize: '13px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
          itemStyle={{ color: '#f5f0e0' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
