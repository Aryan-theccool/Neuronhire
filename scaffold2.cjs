const fs = require('fs');
const path = require('path');
function w(f, c) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
}

// === components/ui/NeuronScoreRing.tsx ===
w('components/profile/NeuronScoreRing.tsx',
`'use client'
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
      <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`}>
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
          transform={\`rotate(-90 \${size / 2} \${size / 2})\`}
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
`);

// === components/profile/SkillBadge.tsx ===
w('components/profile/SkillBadge.tsx',
`interface SkillBadgeProps {
  badge_type: string
  verified: boolean
}

export default function SkillBadge({ badge_type, verified }: SkillBadgeProps) {
  return (
    <span className={\`skill-badge \${verified ? 'skill-badge--verified' : 'skill-badge--unverified'}\`}>
      {verified && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {badge_type}
    </span>
  )
}
`);

// === components/profile/EngineerProfileCard.tsx ===
w('components/profile/EngineerProfileCard.tsx',
`import NeuronScoreRing from './NeuronScoreRing'

interface EngineerProfileCardProps {
  engineer: {
    username: string
    full_name: string | null
    avatar_url: string | null
    neuron_score: number
    ai_stack: string[]
    is_available: boolean
    specializations: string[]
  }
}

export default function EngineerProfileCard({ engineer }: EngineerProfileCardProps) {
  return (
    <div className="engineer-card">
      <div className="engineer-card__header">
        <div className="engineer-card__avatar">
          {engineer.avatar_url ? (
            <img src={engineer.avatar_url} alt={engineer.full_name || ''} />
          ) : (
            <div className="engineer-card__avatar-placeholder">
              {(engineer.full_name || engineer.username)[0]?.toUpperCase()}
            </div>
          )}
          {engineer.is_available && <span className="availability-dot" />}
        </div>
        <div className="engineer-card__info">
          <h3>{engineer.full_name || engineer.username}</h3>
          <p className="engineer-card__username">@{engineer.username}</p>
        </div>
        <NeuronScoreRing score={engineer.neuron_score} size={64} />
      </div>
      <div className="engineer-card__stack">
        {engineer.ai_stack?.slice(0, 4).map(skill => (
          <span key={skill} className="stack-chip">{skill}</span>
        ))}
      </div>
    </div>
  )
}
`);

// === components/hiring/JobCard.tsx ===
w('components/hiring/JobCard.tsx',
`import { formatINR } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  fulltime: '#10b981',
  internship: '#f59e0b',
  hourly: '#0ea5e9',
  project: '#a855f7',
}

interface JobCardProps {
  job: {
    id: string
    title: string
    engagement_type: string
    skills_required: string[]
    budget_min_inr: number | null
    budget_max_inr: number | null
    min_neuron_score: number
    company?: { company_name: string; logo_url: string | null }
  }
}

export default function JobCard({ job }: JobCardProps) {
  const color = TYPE_COLORS[job.engagement_type] || '#6b7280'
  return (
    <div className="job-card">
      <div className="job-card__top">
        <span className="engagement-badge" style={{ borderColor: color, color }}>
          {job.engagement_type.replace('_', ' ')}
        </span>
        {job.min_neuron_score > 0 && (
          <span className="neuron-req">NS {job.min_neuron_score}+</span>
        )}
      </div>
      <h3 className="job-card__title">{job.title}</h3>
      {job.company && <p className="job-card__company">{job.company.company_name}</p>}
      <div className="job-card__budget">
        {job.budget_min_inr && job.budget_max_inr
          ? \`\${formatINR(job.budget_min_inr)} - \${formatINR(job.budget_max_inr)}\`
          : 'Budget flexible'}
      </div>
      <div className="job-card__skills">
        {job.skills_required?.map(s => <span key={s} className="stack-chip">{s}</span>)}
      </div>
      <button className="btn-primary">View & Apply</button>
    </div>
  )
}
`);

// === components/hiring/BountyCard.tsx ===
w('components/hiring/BountyCard.tsx',
`'use client'
import { useEffect, useState } from 'react'
import { formatINR } from '@/lib/utils'

interface BountyCardProps {
  bounty: {
    id: string
    title: string
    problem_description: string
    reward_inr: number
    skills_needed: string[]
    deadline: string | null
    status: string
  }
}

export default function BountyCard({ bounty }: BountyCardProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!bounty.deadline) return
    const tick = () => {
      const diff = new Date(bounty.deadline!).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Expired'); return }
      const days = Math.floor(diff / 86400000)
      const hrs = Math.floor((diff % 86400000) / 3600000)
      setTimeLeft(\`\${days}d \${hrs}h left\`)
    }
    tick()
    const i = setInterval(tick, 60000)
    return () => clearInterval(i)
  }, [bounty.deadline])

  return (
    <div className="bounty-card">
      <div className="bounty-card__reward">{formatINR(bounty.reward_inr)}</div>
      <h3 className="bounty-card__title">{bounty.title}</h3>
      <p className="bounty-card__desc">{bounty.problem_description.slice(0, 120)}...</p>
      {timeLeft && <span className="bounty-card__deadline">{timeLeft}</span>}
      <div className="bounty-card__skills">
        {bounty.skills_needed?.map(s => <span key={s} className="stack-chip">{s}</span>)}
      </div>
      <button className="btn-primary">Submit Solution</button>
    </div>
  )
}
`);

// === components/marketplace/ProductCard.tsx ===
w('components/marketplace/ProductCard.tsx',
`import { formatINR } from '@/lib/utils'

const CAT_COLORS: Record<string, string> = {
  agent: '#a855f7',
  model: '#0ea5e9',
  saas: '#10b981',
  workflow: '#f59e0b',
  dataset: '#ef4444',
  template: '#6366f1',
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    category: string
    price_inr: number | null
    pricing_model: string | null
    thumbnail_url: string | null
    avg_rating: number
    total_sales: number
    tech_stack: string[]
    demo_url: string | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const color = CAT_COLORS[product.category] || '#6b7280'
  const stars = Math.round(product.avg_rating)
  return (
    <div className="product-card group">
      <div className="product-card__thumb">
        {product.thumbnail_url
          ? <img src={product.thumbnail_url} alt={product.name} />
          : <div className="product-card__thumb-placeholder">{product.category}</div>}
        <span className="category-badge" style={{ background: color }}>{product.category}</span>
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.description.slice(0, 80)}...</p>
        <div className="product-card__meta">
          <span className="product-card__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span className="product-card__price">
            {product.pricing_model === 'free' ? 'Free' : product.price_inr ? formatINR(product.price_inr) : 'Contact'}
          </span>
        </div>
        <div className="product-card__stack group-hover:opacity-100">
          {product.tech_stack?.map(s => <span key={s} className="stack-chip stack-chip--sm">{s}</span>)}
        </div>
        <div className="product-card__actions">
          {product.demo_url && <button className="btn-secondary">Try Demo</button>}
          <button className="btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  )
}
`);

console.log('All component files done!');
