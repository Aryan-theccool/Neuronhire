'use client'
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
      setTimeLeft(`${days}d ${hrs}h left`)
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
