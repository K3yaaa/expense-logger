'use client'

import { formatRupiah } from '@/lib/utils'

interface PieSlice {
  label: string
  value: number
  color: string
}

interface VanGoghPieChartProps {
  data: PieSlice[]
  title?: string
}

// Generate SVG arc path with slight organic variation
function describeArc(cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number): string {
  const toRad = (a: number) => (a * Math.PI) / 180
  const x1 = cx + outerR * Math.cos(toRad(startAngle - 90))
  const y1 = cy + outerR * Math.sin(toRad(startAngle - 90))
  const x2 = cx + outerR * Math.cos(toRad(endAngle - 90))
  const y2 = cy + outerR * Math.sin(toRad(endAngle - 90))
  const x3 = cx + innerR * Math.cos(toRad(endAngle - 90))
  const y3 = cy + innerR * Math.sin(toRad(endAngle - 90))
  const x4 = cx + innerR * Math.cos(toRad(startAngle - 90))
  const y4 = cy + innerR * Math.sin(toRad(startAngle - 90))
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`
}

export default function VanGoghPieChart({ data, title }: VanGoghPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'rgba(196,167,231,0.3)' }}>
        Belum ada data untuk ditampilkan.
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const cx = 130
  const cy = 130
  const outerR = 90
  const innerR = 52

  let currentAngle = 0
  const slices = data.map((d) => {
    const angle = total > 0 ? (d.value / total) * 360 : 0
    const start = currentAngle
    const end = currentAngle + angle
    const midAngle = start + angle / 2
    const labelR = innerR + (outerR - innerR) / 2 + 8
    const labelX = cx + labelR * Math.cos(((midAngle - 90) * Math.PI) / 180)
    const labelY = cy + labelR * Math.sin(((midAngle - 90) * Math.PI) / 180)
    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
    const result = {
      ...d,
      start,
      end,
      labelX,
      labelY,
      pct,
      path: angle > 0 ? describeArc(cx, cy, innerR, outerR, start, end) : '',
    }
    currentAngle = end
    return result
  })

  // Star positions around the chart
  const stars = [
    { x: 22, y: 30, size: 3, delay: '0s' },
    { x: 238, y: 25, size: 2.5, delay: '0.5s' },
    { x: 15, y: 200, size: 2, delay: '1s' },
    { x: 248, y: 210, size: 3, delay: '1.5s' },
    { x: 130, y: 8, size: 2, delay: '2s' },
    { x: 55, y: 252, size: 1.8, delay: '0.8s' },
    { x: 205, y: 255, size: 2.2, delay: '1.2s' },
    { x: 8, y: 120, size: 1.5, delay: '2.5s' },
    { x: 255, y: 130, size: 2, delay: '0.3s' },
  ]

  return (
    <div className="relative">
      <svg
        viewBox="0 0 260 280"
        width="100%"
        style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}
      >
        <defs>
          {/* Glow filter for stars */}
          <filter id="star-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Soft glow for segments */}
          <filter id="segment-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Background gradient for chart area */}
          <radialGradient id="chart-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a3e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0d0d2b" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={outerR + 15} fill="url(#chart-bg)" />

        {/* Animated stars */}
        <g filter="url(#star-glow)">
          {stars.map((star, i) => (
            <g key={i}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill="#ffd700"
                opacity="0.9"
                style={{
                  animation: `star-pulse ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: star.delay,
                }}
              />
            </g>
          ))}
        </g>

        {/* Pie slices */}
        {slices.map((slice, i) => {
          if (!slice.path) return null
          return (
            <g key={i}>
              <path
                d={slice.path}
                fill={slice.color}
                opacity="0.85"
                filter="url(#segment-glow)"
                style={{
                  stroke: 'rgba(13,13,43,0.8)',
                  strokeWidth: '1.5',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
              />
            </g>
          )
        })}

        {/* Center total */}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="#0d0d2b" opacity="0.9" />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#ffd700"
          fontSize="11"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          opacity="0.7"
        >
          TOTAL
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="#f5f0e0"
          fontSize="13"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
        >
          {formatRupiah(total)}
        </text>

        {/* Labels on slices */}
        {slices.map((slice, i) => {
          if (slice.pct < 8) return null
          return (
            <text
              key={i}
              x={slice.labelX}
              y={slice.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f5f0e0"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {slice.pct}%
            </text>
          )
        })}

        {/* Swirling decoration lines around edge */}
        <circle cx={cx} cy={cy} r={outerR + 4} fill="none" stroke="rgba(255,215,0,0.1)" strokeWidth="1" strokeDasharray="3 5" />
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2" style={{ color: 'rgba(245,240,224,0.7)' }}>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{
                background: slice.color,
                boxShadow: `0 0 6px ${slice.color}`,
              }}
            />
            <span className="text-xs font-medium">{slice.label}</span>
            <span className="text-xs" style={{ color: 'rgba(196,167,231,0.4)' }}>
              {slice.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes star-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
