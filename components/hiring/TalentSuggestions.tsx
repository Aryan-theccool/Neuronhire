'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface TalentSuggestionsProps {
  skillsRequired: string[]
  minNeuronScore: number
  jobId: string
}

export default function TalentSuggestions({ skillsRequired, minNeuronScore, jobId }: TalentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSuggestions() {
      // Basic matching logic: 
      // 1. Fetch engineers with neuron_score >= minNeuronScore
      // 2. Client-side filter for skill overlap for simplicity in this demo
      const { data, error } = await supabase
        .from('engineers')
        .select('*')
        .gte('neuron_score', minNeuronScore)
        .order('neuron_score', { ascending: false })
        .limit(10)

      if (data) {
        // Simple overlap scoring
        const scored = data.map(eng => {
          const overlap = eng.ai_stack?.filter((s: string) => 
            skillsRequired.some(req => req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase()))
          ).length || 0
          return { ...eng, overlapScore: overlap }
        })

        // Sort by overlap first, then neuron_score
        scored.sort((a, b) => b.overlapScore - a.overlapScore || b.neuron_score - a.neuron_score)
        setSuggestions(scored.slice(0, 3))
      }
      setLoading(false)
    }

    fetchSuggestions()
  }, [skillsRequired, minNeuronScore])

  if (loading) return <div>Scouting top AI talent...</div>
  if (suggestions.length === 0) return null

  return (
    <div className="stat-card" style={{marginTop: '2rem', border: '1px solid var(--primary)', background: 'rgba(var(--primary-rgb), 0.05)'}}>
      <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <span>✨ Smart Talent Recommendations</span>
      </h3>
      <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem'}}>
        Based on your requirements, these engineers are high-match candidates.
      </p>

      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {suggestions.map(eng => (
          <div key={eng.id} style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0.75rem',
            background: 'var(--surface)',
            borderRadius: '8px',
            border: '1px solid var(--outline-variant)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              {eng.avatar_url ? (
                <img src={eng.avatar_url} style={{width: 40, height: 40, borderRadius: '50%'}} alt="" />
              ) : (
                <div style={{width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>
                  {eng.full_name?.[0] || eng.username[0]}
                </div>
              )}
              <div>
                <p style={{fontWeight: 600, fontSize: '0.9rem'}}>{eng.full_name || eng.username}</p>
                <p style={{fontSize: '0.75rem', color: 'var(--secondary)'}}>NS {eng.neuron_score} • {eng.overlapScore} skill matches</p>
              </div>
            </div>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <Link href={`/engineer/${eng.username}`} className="nav__link" style={{fontSize: '0.8rem'}}>View Profile</Link>
              <button 
                className="btn-primary" 
                style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem'}}
                onClick={() => alert(`Invitation sent to ${eng.username} for Job #${jobId}`)}
              >
                Invite
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
