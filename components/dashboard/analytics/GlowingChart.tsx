'use client'

import { useMemo } from 'react'

interface GlowingChartProps {
  data: number[]
  color?: string
  height?: number
  label?: string
}

export function GlowingChart({ data, color = 'var(--primary)', height = 60, label }: GlowingChartProps) {
  const points = useMemo(() => {
    if (!data.length) return ''
    const max = Math.max(...data, 10)
    const width = 200 // Viewbox width
    const step = width / (data.length - 1)
    
    return data.map((val, i) => {
      const x = i * step
      const y = height - (val / max) * height
      return `${x},${y}`
    }).join(' ')
  }, [data, height])

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.7rem', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>{label}</span>
          <span style={{ color }}>Trend: Positive</span>
        </div>
      )}
      <svg 
        viewBox={`0 0 200 ${height}`} 
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fill Area */}
        <path
          d={`M 0,${height} L ${points} L 200,${height} Z`}
          fill={`url(#grad-${label})`}
        />

        {/* The Glowing Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          style={{
            strokeDasharray: '400',
            strokeDashoffset: '400',
            animation: 'drawPath 2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        />
      </svg>

      <style jsx>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
