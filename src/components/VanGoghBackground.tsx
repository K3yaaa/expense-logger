'use client'

import { useEffect, useRef } from 'react'

// Elegant watercolor ink wash background — pear.no inspired
function WatercolorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // Pear.no inspired watercolor palette — soft muted tones
    const palette = [
      { r: 26, g: 35, b: 126, a: 0.035 },   // deep indigo
      { r: 40, g: 53, b: 147, a: 0.04 },    // water blue
      { r: 92, g: 107, b: 192, a: 0.03 },   // soft purple
      { r: 141, g: 110, b: 99, a: 0.025 },  // earth brown
      { r: 212, g: 165, b: 116, a: 0.025 }, // soft gold
      { r: 245, g: 240, b: 224, a: 0.015 }, // cream wash
      { r: 156, g: 139, b: 180, a: 0.02 },  // muted lavender
      { r: 180, g: 160, b: 130, a: 0.02 },  // warm stone
    ]

    // Generate organic blob shapes
    const generateBlobPoints = (cx: number, cy: number, radius: number, time: number, seed: number) => {
      const points: Array<{ x: number; y: number }> = []
      const numPoints = 8
      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2
        const wobble = Math.sin(time * 0.00015 + seed + i * 1.3) * radius * 0.15
        const r = radius + wobble
        points.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
        })
      }
      return points
    }

    const drawOrganicBlob = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      color: { r: number; g: number; b: number; a: number },
      time: number,
      seed: number,
    ) => {
      const points = generateBlobPoints(cx, cy, radius, time, seed)

      ctx.beginPath()
      for (let i = 0; i < points.length; i++) {
        const curr = points[i]
        const next = points[(i + 1) % points.length]

        if (i === 0) {
          ctx.moveTo(curr.x, curr.y)
        }

        const cpX = (curr.x + next.x) / 2 + Math.sin(time * 0.0002 + i + seed) * radius * 0.08
        const cpY = (curr.y + next.y) / 2 + Math.cos(time * 0.0002 + i + seed) * radius * 0.08
        ctx.quadraticCurveTo(cpX, cpY, next.x, next.y)
      }
      ctx.closePath()

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
      gradient.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${color.a})`)
      gradient.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${color.a * 0.5})`)
      gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw flowing ink wash brushstroke
    const drawInkStroke = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      length: number,
      angle: number,
      color: { r: number; g: number; b: number; a: number },
      time: number,
      seed: number,
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)

      const steps = 20
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const px = t * length
        const py = Math.sin(t * Math.PI * 2 + time * 0.0001 + seed) * 8 + Math.cos(t * Math.PI * 1.5 + seed * 0.7) * 5
        if (i === 0) ctx.moveTo(px, py)
        else {
          const prevX = ((i - 1) / steps) * length
          const prevT = (i - 1) / steps
          const prevY = Math.sin(prevT * Math.PI * 2 + time * 0.0001 + seed) * 8 + Math.cos(prevT * Math.PI * 1.5 + seed * 0.7) * 5
          const mx = (prevX + px) / 2
          const my = (prevY + py) / 2
          ctx.quadraticCurveTo(mx, my, px, py)
        }
      }

      ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
      ctx.lineWidth = 0.8 + Math.sin(seed) * 0.4
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
    }

    // Blob configurations — scattered organically across screen
    const blobConfigs = Array.from({ length: 12 }, (_, i) => ({
      baseX: 0.08 + (i % 4) * 0.25 + Math.sin(i * 2.3) * 0.1,
      baseY: 0.1 + Math.floor(i / 4) * 0.3 + Math.cos(i * 1.7) * 0.12,
      baseRadius: 180 + (i % 3) * 80,
      paletteIdx: i % palette.length,
      speedX: 0.00003 + (i % 3) * 0.00001,
      speedY: 0.00002 + (i % 4) * 0.000008,
      phaseX: i * 1.1,
      phaseY: i * 0.9,
    }))

    const render = (timestamp: number) => {
      if (!width || !height) {
        animRef.current = requestAnimationFrame(render)
        return
      }

      lastTimeRef.current = timestamp

      ctx.clearRect(0, 0, width, height)

      // Layer 1: Watercolor wash blobs
      blobConfigs.forEach((blob, i) => {
        const cx = (Math.sin(timestamp * blob.speedX + blob.phaseX) * 0.12 + blob.baseX) * width
        const cy = (Math.cos(timestamp * blob.speedY + blob.phaseY) * 0.08 + blob.baseY) * height
        const radius = blob.baseRadius + Math.sin(timestamp * 0.00003 + i) * 40

        drawOrganicBlob(ctx, cx, cy, radius, palette[blob.paletteIdx], timestamp, i * 0.8)
      })

      // Layer 2: Ink wash strokes — very subtle flowing lines
      for (let i = 0; i < 8; i++) {
        const sx = (Math.sin(i * 1.3 + timestamp * 0.00001) * 0.3 + 0.2) * width
        const sy = (Math.cos(i * 0.9 + timestamp * 0.000008) * 0.25 + 0.3 + i * 0.08) * height
        const len = 80 + (i % 3) * 60
        const angle = Math.sin(i * 0.7) * 0.4
        const color = palette[(i + 2) % palette.length]
        drawInkStroke(ctx, sx, sy, len, angle, color, timestamp, i * 1.2)
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

// Organic flowing SVG ink wash decoration — top right
function InkWashTop() {
  return (
    <svg
      viewBox="0 0 300 200"
      style={{
        position: 'absolute',
        top: '5%',
        right: '-5%',
        width: 'clamp(200px, 30vw, 400px)',
        height: 'clamp(130px, 20vw, 260px)',
        zIndex: 1,
        opacity: 0.07,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="wash-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="ink-soft">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* Flowing wash strokes */}
      <ellipse cx="150" cy="100" rx="140" ry="80" fill="#5c6bc0" filter="url(#wash-blur)" opacity="0.6" />
      <ellipse cx="180" cy="80" rx="100" ry="60" fill="#d4a574" filter="url(#wash-blur)" opacity="0.5" />
      <ellipse cx="120" cy="120" rx="90" ry="55" fill="#1a237e" filter="url(#wash-blur)" opacity="0.4" />
      {/* Organic ink lines */}
      <path
        d="M30 80 Q80 40 130 70 Q180 100 220 60 Q260 20 290 50"
        stroke="#1a237e"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        filter="url(#ink-soft)"
      />
      <path
        d="M20 120 Q70 150 120 110 Q170 70 220 100 Q270 130 295 90"
        stroke="#8d6e63"
        strokeWidth="1"
        fill="none"
        opacity="0.25"
        filter="url(#ink-soft)"
      />
      <path
        d="M40 160 Q90 130 140 150 Q190 170 240 140 Q280 120 300 145"
        stroke="#283593"
        strokeWidth="0.8"
        fill="none"
        opacity="0.2"
        filter="url(#ink-soft)"
      />
    </svg>
  )
}

// Organic flowing SVG ink wash — bottom left
function InkWashBottom() {
  return (
    <svg
      viewBox="0 0 300 200"
      style={{
        position: 'absolute',
        bottom: '5%',
        left: '-5%',
        width: 'clamp(200px, 30vw, 400px)',
        height: 'clamp(130px, 20vw, 260px)',
        zIndex: 1,
        opacity: 0.06,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="wash-blur-2">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="ink-soft-2">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* Flowing wash strokes */}
      <ellipse cx="150" cy="100" rx="140" ry="85" fill="#283593" filter="url(#wash-blur-2)" opacity="0.5" />
      <ellipse cx="100" cy="80" rx="110" ry="65" fill="#5c6bc0" filter="url(#wash-blur-2)" opacity="0.4" />
      <ellipse cx="180" cy="130" rx="90" ry="55" fill="#d4a574" filter="url(#wash-blur-2)" opacity="0.35" />
      {/* Organic ink lines */}
      <path
        d="M20 60 Q70 30 130 55 Q190 80 240 45 Q280 15 300 40"
        stroke="#8d6e63"
        strokeWidth="1.2"
        fill="none"
        opacity="0.25"
        filter="url(#ink-soft-2)"
      />
      <path
        d="M10 110 Q60 140 120 105 Q180 70 230 100 Q280 130 300 95"
        stroke="#5c6bc0"
        strokeWidth="0.8"
        fill="none"
        opacity="0.2"
        filter="url(#ink-soft-2)"
      />
    </svg>
  )
}

// Subtle floating organic blob accents
function FloatingBlobs() {
  const blobs = [
    { x: '15%', y: '20%', size: 180, color: '#1a237e', delay: '0s', duration: '25s' },
    { x: '75%', y: '60%', size: 140, color: '#5c6bc0', delay: '-8s', duration: '30s' },
    { x: '85%', y: '15%', size: 100, color: '#d4a574', delay: '-15s', duration: '22s' },
    { x: '5%', y: '70%', size: 120, color: '#283593', delay: '-5s', duration: '28s' },
  ]

  return (
    <>
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: blob.color,
            opacity: 0.04,
            filter: 'blur(40px)',
            animation: `float-organic ${blob.duration} ease-in-out infinite`,
            animationDelay: blob.delay,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes float-organic {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(15px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
      `}</style>
    </>
  )
}

export default function VanGoghBackground() {
  return (
    <>
      <WatercolorCanvas />
      <InkWashTop />
      <InkWashBottom />
      <FloatingBlobs />
    </>
  )
}
