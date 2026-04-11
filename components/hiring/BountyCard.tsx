'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

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
      setTimeLeft(`${days}d ${hrs}h left`)
    }
    tick()
    const i = setInterval(tick, 60000)
    return () => clearInterval(i)
  }, [bounty.deadline])

  return (
    <div className="bounty-card glass-card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="bounty-card__reward" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', background: 'rgba(173, 198, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(173, 198, 255, 0.2)' }}>
          {formatCurrency(bounty.reward_inr)}
        </div>
        {timeLeft && (
          <span className="glass-badge glass-badge--available" style={{ fontSize: '0.7rem' }}>
            {timeLeft}
          </span>
        )}
      </div>

      <div>
        <h3 className="bounty-card__title" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          {bounty.title}
        </h3>
        <p className="bounty-card__desc" style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
          {bounty.problem_description.slice(0, 140)}...
        </p>
      </div>

      <div className="bounty-card__skills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
        {(bounty.skills_needed || []).map(s => <span key={s} className="stack-chip stack-chip--sm">{s}</span>)}
      </div>

      <Link href={`/bounties/${bounty.id}`} className="btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
        View Details
      </Link>
    </div>
  )
}
