'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface MatchedEngineer {
  id: string
  full_name: string
  username: string
  avatar_url?: string
  neuron_score: number
  ai_stack: string[]
  match_score: number
  matched_skills: string[]
  reasoning: string
}

interface PrecisionMatchesProps {
  engineers: MatchedEngineer[]
}

export function PrecisionMatches({ engineers }: PrecisionMatchesProps) {
  const [showAll, setShowAll] = useState(false)
  const [invitingId, setInvitingId] = useState<string | null>(null)
  const [personalizingId, setPersonalizingId] = useState<string | null>(null)
  const [customMessage, setCustomMessage] = useState('')

  const filteredEngineers = useMemo(() => {
    if (showAll) return engineers
    return engineers.filter(e => e.match_score >= 75)
  }, [engineers, showAll])

  const handleQuickInvite = (id: string) => {
    setInvitingId(id)
    // Simulate API call
    setTimeout(() => {
      setInvitingId(null)
      alert('Invitation sent! Target talent has been prioritized.')
    }, 1200)
  }

  const handleCustomInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setInvitingId(personalizingId)
    // Simulate API call
    setTimeout(() => {
      setInvitingId(null)
      setPersonalizingId(null)
      setCustomMessage('')
      alert('Personalized invitation dispatched to neural network.')
    }, 1500)
  }

  if (engineers.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--on-surface-variant)' }}>
          Post your first AI role or Bounty to activate the Precision Matching Engine.
        </p>
      </div>
    )
  }

  return (
    <div className="precision-matches-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>Precision Matches</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>High Relevance Only</span>
          <button 
            onClick={() => setShowAll(!showAll)}
            className={`toggle-switch ${!showAll ? 'toggle-active' : ''}`}
            style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: !showAll ? 'var(--primary)' : 'var(--surface-container-highest)',
              position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s'
            }}
          >
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
              position: 'absolute', top: '3px', left: !showAll ? '23px' : '3px', transition: '0.3s'
            }} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {filteredEngineers.map((e) => (
          <div key={e.id} className="glass-card-premium" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'var(--surface-container-low)', overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.05)'
              }}>
                {e.avatar_url ? <img src={e.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {e.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{
                position: 'absolute', bottom: '-4px', right: '-4px',
                background: 'var(--primary)', color: '#000', fontSize: '0.65rem',
                fontWeight: 900, padding: '2px 6px', borderRadius: '4px', border: '2px solid var(--surface-container-low)'
              }}>
                {e.neuron_score}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{e.full_name}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary)' }}>@{e.username}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: e.match_score > 90 ? 'var(--success)' : '#fff' }}>
                    {e.match_score}%
                  </div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 700, letterSpacing: '0.05em' }}>Match</div>
                </div>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--success)' }}>⚡</span> {e.reasoning}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {e.matched_skills.map(skill => (
                  <span key={skill} style={{ fontSize: '0.65rem', background: 'rgba(173, 198, 255, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(173, 198, 255, 0.2)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => handleQuickInvite(e.id)}
                disabled={invitingId === e.id}
                className="btn-primary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                {invitingId === e.id ? 'Sending...' : 'Quick Invite'}
              </button>
              <button 
                onClick={() => setPersonalizingId(e.id)}
                className="btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                Personalize
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Personalization Modal */}
      {personalizingId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '2rem'
        }}>
          <div className="glass-card-premium" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Personalize Invitation</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
              Mention a specific technical challenge to increase your chance of acceptance by 40%.
            </p>
            <form onSubmit={handleCustomInvite}>
              <textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g. We loved your work on Llama-3 optimization! We have a specialized inference bottleneck we'd like you to solve..."
                rows={5}
                required
                className="form-textarea"
                style={{ marginBottom: '2rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={invitingId === personalizingId} className="btn-primary" style={{ flex: 1 }}>
                  {invitingId === personalizingId ? 'Sending...' : 'Send Invitation'}
                </button>
                <button type="button" onClick={() => setPersonalizingId(null)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAll && filteredEngineers.length < engineers.length && (
        <button onClick={() => setShowAll(false)} className="btn-secondary" style={{ alignSelf: 'center' }}>
          Reset to High Relevance
        </button>
      )}
    </div>
  )
}
