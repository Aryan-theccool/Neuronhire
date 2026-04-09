'use client'

import { useState } from 'react'
import { acceptProposal } from '@/app/actions/contracts'
import Link from 'next/link'

interface ProposalListProps {
  proposals: any[]
  role: 'company' | 'engineer'
}

export function ProposalList({ proposals, role }: ProposalListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAccept(id: string) {
    if (!confirm('Are you sure you want to hire this engineer?')) return
    setLoading(id)
    const res = await acceptProposal(id)
    setLoading(null)
    if (res.error) alert(res.error)
    else alert('Success! Work has officially started.')
  }

  return (
    <div className="stat-card">
      <h3 style={{marginBottom: '1.5rem'}}>{role === 'company' ? 'Review Candidates' : 'My Applications'}</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {proposals.map(p => (
          <div key={p.id} style={{
            padding: '1rem', 
            border: '1px solid var(--outline-variant)', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{fontWeight: 600}}>
                {role === 'company' ? (p.engineer?.full_name || p.engineer?.username) : p.job?.title}
              </p>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
                {role === 'company' ? `Applied for: ${p.job?.title}` : `Company: ${p.job?.company?.company_name}`}
              </p>
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                <span className="status-badge" style={{
                  background: p.status === 'accepted' ? '#4CAF50' : p.status === 'pending' ? '#FF9800' : '#F44336',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '1rem',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  {p.status}
                </span>
                {role === 'company' && (
                  <span style={{fontSize: '0.75rem', color: 'var(--secondary)'}}>NS: {p.engineer?.neuron_score}</span>
                )}
              </div>
            </div>

            <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
              {role === 'company' && p.status === 'pending' && (
                <button 
                  className="btn-primary" 
                  style={{fontSize: '0.8rem', padding: '0.4rem 1rem'}}
                  onClick={() => handleAccept(p.id)}
                  disabled={!!loading}
                >
                  {loading === p.id ? 'Hiring...' : 'Accept & Hire'}
                </button>
              )}
              <Link 
                href={role === 'company' ? `/engineer/${p.engineer?.username}` : `/jobs/${p.job_id}`}
                className="nav__link" 
                style={{fontSize: '0.85rem'}}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
        {proposals.length === 0 && <p style={{textAlign: 'center', color: 'var(--on-surface-variant)'}}>No active proposals found.</p>}
      </div>
    </div>
  )
}
