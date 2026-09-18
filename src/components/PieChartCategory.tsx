'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CATEGORIES, Category } from '@/types'

interface PieChartCategoryProps {
  data: { category: Category; total: number }[]
}

const COLORS: Record<Category, string> = {
  makanan: '#f0c040',
  transport: '#00d4ff',
  belanja: '#c4a7e7',
  hiburan: '#ff9ecd',
  lain: '#8b9dc3',
}

export default function PieChartCategory({ data }: PieChartCategoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'rgba(196,167,231,0.3)' }}>
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: CATEGORIES[item.category]?.label ?? item.category,
    value: item.total,
    color: COLORS[item.category] ?? '#8b9dc3',
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
              style={{ filter: `drop-shadow(0 0 6px ${entry.color}40)` }}
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
            backgroundColor: 'rgba(13,13,43,0.95)',
            border: '1px solid rgba(255,215,0,0.15)',
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
