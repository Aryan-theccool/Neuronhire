'use client'
import { useEffect, useState } from 'react'

interface NeuronScoreRingProps {
  score: number
  size?: number
  breakdown?: {
    projects: number
    assessments: number
    ratings: number
    marketplace: number
    community: number
  }
}

export default function NeuronScoreRing({ score, size = 180, breakdown }: NeuronScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (animatedScore / 1000) * circumference
  const offset = circumference - progress

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setAnimatedScore(Math.round(score * eased))
      if (pct < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const getColor = (s: number) => {
    if (s >= 800) return '#a855f7'
    if (s >= 600) return '#8b5cf6'
    if (s >= 400) return '#0ea5e9'
    return '#6b7280'
  }

  return (
    <div className="neuron-ring-wrapper group relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34b5fa" />
            <stop offset="100%" stopColor="#cc97ff" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#192540" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#ringGradient)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle"
          className="text-3xl font-bold" fill={getColor(animatedScore)}
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: size * 0.2 }}>
          {animatedScore}
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle"
          fill="#a3aac4" style={{ fontFamily: 'Inter, sans-serif', fontSize: size * 0.07 }}>
          NeuronScore
        </text>
      </svg>
      {breakdown && (
        <div className="neuron-tooltip">
          <div className="tooltip-row"><span>Projects</span><span>{breakdown.projects}/300</span></div>
          <div className="tooltip-row"><span>Assessments</span><span>{breakdown.assessments}/200</span></div>
          <div className="tooltip-row"><span>Ratings</span><span>{breakdown.ratings}/200</span></div>
          <div className="tooltip-row"><span>Marketplace</span><span>{breakdown.marketplace}/150</span></div>
          <div className="tooltip-row"><span>Community</span><span>{breakdown.community}/150</span></div>
        </div>
      )}
    </div>
  )
}
