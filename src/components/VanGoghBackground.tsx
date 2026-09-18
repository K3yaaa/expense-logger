'use client'

import { useEffect, useRef } from 'react'

// Swirling brushstroke sky rendered on canvas
function VanGoghCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
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

    // Deep Starry Night blues and indigos
    const palette = [
      '#1a237e', '#1b2a6d', '#1a1a4e', '#16213e', '#0f172a',
      '#283593', '#303f9f', '#3949ab', '#3f51b5',
      '#1565c0', '#1976d2',
    ]
    const accentPalette = [
      '#ff8f00', '#ffa000', '#ffb300', '#ff6f00',
      '#ffd54f', '#ffca28', '#ffc107',
    ]

    const drawBrushstroke = (
      cx: number,
      cy: number,
      maxRadius: number,
      baseRotation: number,
      color: string,
      lineWidth: number,
      alpha: number,
      wobbleFreq: number,
      wobbleAmp: number,
      spiralTightness: number,
    ) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(baseRotation)
      ctx.beginPath()

      const totalSteps = 60
      for (let t = 0; t < totalSteps; t++) {
        const progress = t / totalSteps
        const r = progress * maxRadius
        const angle = progress * Math.PI * spiralTightness
        const x = r * Math.cos(angle)
        const y = r * Math.sin(angle)
        // Add organic wobble
        const wx = Math.sin(progress * wobbleFreq * Math.PI) * wobbleAmp * (1 - progress)
        const wy = Math.cos(progress * wobbleFreq * 0.7 * Math.PI) * wobbleAmp * (1 - progress)

        if (t === 0) {
          ctx.moveTo(x + wx, y + wy)
        } else {
          const prevProgress = (t - 1) / totalSteps
          const prevR = prevProgress * maxRadius
          const prevAngle = prevProgress * Math.PI * spiralTightness
          const px = prevR * Math.cos(prevAngle) + Math.sin(prevProgress * wobbleFreq * Math.PI) * wobbleAmp * (1 - prevProgress)
          const py = prevR * Math.sin(prevAngle) + Math.cos(prevProgress * wobbleFreq * 0.7 * Math.PI) * wobbleAmp * (1 - prevProgress)

          const mx = (px + x + wx) / 2
          const my = (py + y + wy) / 2
          ctx.quadraticCurveTo(mx, my, x + wx, y + wy)
        }
      }

      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.globalAlpha = alpha
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      ctx.restore()
    }

    // Draw wavy horizontal strokes (impressionist sky lines)
    const drawWaveStroke = (
      startX: number,
      startY: number,
      length: number,
      angle: number,
      color: string,
      lineWidth: number,
      alpha: number,
      waveFreq: number,
      waveAmp: number,
    ) => {
      ctx.save()
      ctx.translate(startX, startY)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)

      const steps = 40
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const x = t * length
        const y = Math.sin(t * Math.PI * waveFreq) * waveAmp
        if (i === 0) ctx.moveTo(x, y)
        else {
          const px = ((i - 1) / steps) * length
          const py = Math.sin(((i - 1) / steps) * Math.PI * waveFreq) * waveAmp
          const mx = (px + x) / 2
          const my = (py + y) / 2
          ctx.quadraticCurveTo(mx, my, x, y)
        }
      }

      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.globalAlpha = alpha
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
    }

    // Pre-generate swirl centers for consistent layout
    const swirlCenters = [
      { x: 0.2, y: 0.25, r: 0.35 },
      { x: 0.7, y: 0.2, r: 0.3 },
      { x: 0.5, y: 0.15, r: 0.4 },
      { x: 0.85, y: 0.35, r: 0.25 },
      { x: 0.15, y: 0.4, r: 0.28 },
      { x: 0.55, y: 0.3, r: 0.22 },
      { x: 0.35, y: 0.18, r: 0.32 },
      { x: 0.9, y: 0.15, r: 0.2 },
    ]

    const render = (timestamp: number) => {
      if (!width || !height) {
        animRef.current = requestAnimationFrame(render)
        return
      }

      const delta = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      // Slow rotation: one full rotation every ~120 seconds
      rotationRef.current += (delta / 120000) * Math.PI * 2

      ctx.clearRect(0, 0, width, height)

      // Draw multiple swirl layers
      swirlCenters.forEach((center, idx) => {
        const cx = center.x * width
        const cy = center.y * height
        const maxR = center.r * Math.max(width, height)
        const rot = rotationRef.current + (idx * Math.PI) / 4

        // Layer 1: deep blue strokes
        for (let i = 0; i < 4; i++) {
          const color = palette[(idx + i) % palette.length]
          const lineW = 1.5 + Math.random() * 2.5
          const alpha = 0.04 + Math.random() * 0.05
          const freq = 2 + i * 0.5 + Math.random()
          const amp = 8 + Math.random() * 15
          const tightness = 2 + Math.random() * 2
          drawBrushstroke(cx, cy, maxR, rot + i * 0.5, color, lineW, alpha, freq, amp, tightness)
        }
      })

      // Layer 2: horizontal-ish wavy brushstrokes across sky
      for (let i = 0; i < 12; i++) {
        const sx = Math.random() * width * 1.2 - width * 0.1
        const sy = (0.05 + Math.random() * 0.5) * height
        const len = 100 + Math.random() * 300
        const angle = -0.1 + Math.random() * 0.2
        const color = palette[Math.floor(Math.random() * palette.length)]
        const lw = 1 + Math.random() * 2
        const alpha = 0.03 + Math.random() * 0.04
        const freq = 1 + Math.random() * 3
        const amp = 5 + Math.random() * 20
        drawWaveStroke(sx, sy, len, angle, color, lw, alpha, freq, amp)
      }

      // Layer 3: warm accent strokes
      for (let i = 0; i < 6; i++) {
        const cx = Math.random() * width
        const cy = Math.random() * height * 0.5
        const maxR = 50 + Math.random() * 150
        const color = accentPalette[Math.floor(Math.random() * accentPalette.length)]
        const lineW = 1 + Math.random() * 1.5
        const alpha = 0.03 + Math.random() * 0.04
        const freq = 2 + Math.random() * 3
        const amp = 5 + Math.random() * 10
        const tightness = 1.5 + Math.random() * 2
        drawBrushstroke(cx, cy, maxR, rotationRef.current * 0.3 + i, color, lineW, alpha, freq, amp, tightness)
      }

      // Layer 4: small quick strokes everywhere
      for (let i = 0; i < 20; i++) {
        const sx = Math.random() * width
        const sy = Math.random() * height * 0.6
        const len = 30 + Math.random() * 80
        const angle = Math.random() * Math.PI
        const color = palette[Math.floor(Math.random() * palette.length)]
        const lw = 0.5 + Math.random() * 1
        const alpha = 0.02 + Math.random() * 0.03
        const freq = 1 + Math.random() * 2
        const amp = 3 + Math.random() * 8
        drawWaveStroke(sx, sy, len, angle, color, lw, alpha, freq, amp)
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

// Crescent moon — top right
function CrescentMoon() {
  return (
    <svg
      viewBox="0 0 80 80"
      style={{
        position: 'absolute',
        top: '8%',
        right: '12%',
        width: 'clamp(50px, 8vw, 80px)',
        height: 'clamp(50px, 8vw, 80px)',
        zIndex: 2,
        filter: 'drop-shadow(0 0 12px rgba(255,213,79,0.4))',
        animation: 'moon-glow 4s ease-in-out infinite alternate',
      }}
    >
      <defs>
        <radialGradient id="moonGlow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="60%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#ff8f00" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="30" fill="url(#moonGlow)" />
      {/* Cover circle to create crescent — offset to the right */}
      <circle cx="54" cy="35" r="24" fill="#0a0a0a" />
      {/* Subtle texture strokes */}
      <path d="M25 30 Q30 35 25 42" stroke="#ff8f00" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M20 40 Q24 38 22 45" stroke="#ff8f00" strokeWidth="0.4" fill="none" opacity="0.2" />
      <style>{`
        @keyframes moon-glow {
          0% { filter: drop-shadow(0 0 8px rgba(255,213,79,0.3)); }
          100% { filter: drop-shadow(0 0 16px rgba(255,213,79,0.5)); }
        }
      `}</style>
    </svg>
  )
}

// Cypress tree — left side, tall and dark
function CypressTree() {
  return (
    <svg
      viewBox="0 0 80 400"
      style={{
        position: 'absolute',
        bottom: '18%',
        left: '6%',
        width: 'clamp(40px, 6vw, 80px)',
        height: 'clamp(180px, 30vw, 360px)',
        zIndex: 2,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
      }}
    >
      {/* Trunk — tall narrow S-curve */}
      <path
        d="M40 400 C38 360 42 320 38 280 C34 240 42 200 38 160 C34 120 40 90 40 80"
        stroke="#0f1a0f"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left edge of tree mass */}
      <path
        d="M40 80 C35 120 30 180 28 250 C26 300 30 350 32 400"
        stroke="#0f1a0f"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right edge */}
      <path
        d="M40 80 C45 120 50 180 52 250 C54 300 50 350 48 400"
        stroke="#0f1a0f"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Brushy fill — multiple overlapping blobs */}
      <ellipse cx="40" cy="110" rx="14" ry="45" fill="#0f1a0f" />
      <ellipse cx="36" cy="100" rx="10" ry="38" fill="#152015" />
      <ellipse cx="44" cy="115" rx="12" ry="42" fill="#0f1a0f" />
      <ellipse cx="40" cy="140" rx="16" ry="50" fill="#0f1a0f" />
      <ellipse cx="35" cy="135" rx="11" ry="45" fill="#111a11" />
      <ellipse cx="45" cy="145" rx="13" ry="48" fill="#0f1a0f" />
      <ellipse cx="40" cy="170" rx="18" ry="55" fill="#0f1a0f" />
      <ellipse cx="33" cy="165" rx="12" ry="48" fill="#152015" />
      <ellipse cx="47" cy="175" rx="14" ry="52" fill="#0f1a0f" />
      <ellipse cx="40" cy="200" rx="20" ry="60" fill="#0f1a0f" />
      <ellipse cx="32" cy="195" rx="13" ry="52" fill="#111a11" />
      <ellipse cx="48" cy="205" rx="15" ry="55" fill="#0f1a0f" />
      <ellipse cx="40" cy="230" rx="22" ry="65" fill="#0f1a0f" />
      <ellipse cx="30" cy="225" rx="14" ry="58" fill="#152015" />
      <ellipse cx="50" cy="235" rx="16" ry="60" fill="#0f1a0f" />
      <ellipse cx="40" cy="260" rx="23" ry="70" fill="#0f1a0f" />
      <ellipse cx="28" cy="255" rx="15" ry="60" fill="#111a11" />
      <ellipse cx="52" cy="265" rx="17" ry="63" fill="#0f1a0f" />
      <ellipse cx="40" cy="295" rx="24" ry="75" fill="#0f1a0f" />
      <ellipse cx="26" cy="285" rx="16" ry="62" fill="#152015" />
      <ellipse cx="54" cy="295" rx="18" ry="65" fill="#0f1a0f" />
      <ellipse cx="40" cy="330" rx="25" ry="80" fill="#0f1a0f" />
      <ellipse cx="24" cy="315" rx="17" ry="65" fill="#111a11" />
      <ellipse cx="56" cy="325" rx="19" ry="68" fill="#0f1a0f" />
      {/* Fine texture strokes */}
      <path d="M36 90 Q30 120 28 160" stroke="#1a2e1a" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M44 95 Q50 130 52 170" stroke="#1a2e1a" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M34 150 Q28 200 26 260" stroke="#0f1a0f" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M46 160 Q52 210 54 270" stroke="#0f1a0f" strokeWidth="0.8" fill="none" opacity="0.5" />
    </svg>
  )
}

// 4-pointed twinkling star
function Star({ x, y, size, delay }: { x: string; y: string; size: number; delay: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex: 3,
        filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))',
        animation: `star-twinkle 2.5s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <path
        d="M10 0 L11.5 7.5 L20 10 L11.5 12.5 L10 20 L8.5 12.5 L0 10 L8.5 7.5 Z"
        fill="#ffd54f"
      />
    </svg>
  )
}

// Village silhouette — bottom center with church spire
function VillageSilhouette() {
  return (
    <svg
      viewBox="0 0 300 100"
      style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(200px, 35vw, 380px)',
        height: 'clamp(60px, 10vw, 100px)',
        zIndex: 2,
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
      }}
    >
      {/* Church with spire */}
      <path d="M140 100 L140 55 L145 55 L145 45 L150 35 L155 45 L155 55 L160 55 L160 100" fill="#1a1a2e" />
      {/* Church base */}
      <rect x="130" y="70" width="40" height="30" fill="#1a1a2e" />
      {/* Church window (arch) */}
      <path d="M147 65 A3 3 0 0 1 153 65 L153 72 L147 72 Z" fill="#ffd54f" opacity="0.4" />
      {/* Church door */}
      <rect x="145" y="82" width="10" height="18" fill="#0a0a0a" />

      {/* House 1 — left of church */}
      <path d="M95 100 L95 70 L90 65 L115 65 L110 70 L110 100" fill="#1a1a2e" />
      <rect x="98" y="78" width="8" height="10" fill="#ffd54f" opacity="0.3" />
      <rect x="98" y="88" width="8" height="12" fill="#0a0a0a" />

      {/* House 2 — right of church */}
      <path d="M175 100 L175 68 L170 63 L195 63 L190 68 L190 100" fill="#1a1a2e" />
      <rect x="178" y="76" width="8" height="10" fill="#ffd54f" opacity="0.3" />
      <rect x="178" y="86" width="8" height="14" fill="#0a0a0a" />

      {/* Small house — far left */}
      <path d="M60 100 L60 80 L55 75 L80 75 L75 80 L75 100" fill="#1a1a2e" />
      <rect x="63" y="85" width="7" height="8" fill="#ffd54f" opacity="0.25" />
      <rect x="63" y="93" width="7" height="7" fill="#0a0a0a" />

      {/* Small house — far right */}
      <path d="M210 100 L210 78 L205 73 L230 73 L225 78 L225 100" fill="#1a1a2e" />
      <rect x="213" y="83" width="7" height="9" fill="#ffd54f" opacity="0.25" />
      <rect x="213" y="92" width="7" height="8" fill="#0a0a0a" />

      {/* Very far left — tiny house */}
      <path d="M25 100 L25 85 L22 82 L45 82 L42 85 L42 100" fill="#1a1a2e" />
      <rect x="28" y="88" width="6" height="6" fill="#ffd54f" opacity="0.2" />

      {/* Very far right — tiny house */}
      <path d="M255 100 L255 85 L252 82 L275 82 L272 85 L272 100" fill="#1a1a2e" />
      <rect x="258" y="88" width="6" height="6" fill="#ffd54f" opacity="0.2" />

      {/* Rolling hills base */}
      <path
        d="M0 95 Q50 88 100 92 Q150 88 200 93 Q250 88 300 95 L300 100 L0 100 Z"
        fill="#1a1a2e"
      />
    </svg>
  )
}

// Twinkling stars scattered across the sky
function Stars() {
  const stars = [
    { x: '12%', y: '8%', size: 14, delay: '0s' },
    { x: '85%', y: '5%', size: 12, delay: '0.4s' },
    { x: '45%', y: '3%', size: 16, delay: '0.8s' },
    { x: '70%', y: '12%', size: 11, delay: '1.2s' },
    { x: '25%', y: '15%', size: 13, delay: '1.6s' },
    { x: '92%', y: '18%', size: 10, delay: '0.2s' },
    { x: '5%', y: '25%', size: 12, delay: '0.6s' },
    { x: '55%', y: '8%', size: 15, delay: '1s' },
    { x: '38%', y: '20%', size: 11, delay: '1.4s' },
    { x: '78%', y: '28%', size: 13, delay: '0.3s' },
    { x: '15%', y: '35%', size: 10, delay: '0.9s' },
    { x: '62%', y: '25%', size: 12, delay: '1.7s' },
    { x: '88%', y: '38%', size: 9, delay: '0.5s' },
    { x: '30%', y: '28%', size: 14, delay: '1.3s' },
    { x: '50%', y: '18%', size: 11, delay: '1.9s' },
    { x: '8%', y: '50%', size: 10, delay: '0.7s' },
    { x: '95%', y: '45%', size: 12, delay: '1.1s' },
    { x: '42%', y: '12%', size: 9, delay: '2s' },
    { x: '72%', y: '40%', size: 11, delay: '0.1s' },
    { x: '20%', y: '45%', size: 10, delay: '1.5s' },
  ]

  return (
    <>
      {stars.map((star, i) => (
        <Star key={i} x={star.x} y={star.y} size={star.size} delay={star.delay} />
      ))}
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  )
}

export default function VanGoghBackground() {
  return (
    <>
      <VanGoghCanvas />
      <CrescentMoon />
      <CypressTree />
      <VillageSilhouette />
      <Stars />
    </>
  )
}
