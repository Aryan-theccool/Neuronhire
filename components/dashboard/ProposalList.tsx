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
    <div className="glass-card" style={{padding: '2rem'}}>
      <div className="form-section-title" style={{marginBottom: '2rem'}}>
        {role === 'company' ? 'Talent Pipelines' : 'Active Applications'}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        {proposals.map(p => (
          <div key={p.id} style={{
            padding: '1.25rem', 
            background: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)', 
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }} className="hover:border-primary">
            <div>
              <p style={{fontWeight: 700, fontSize: '1rem', color: 'var(--on-surface)'}}>
                {role === 'company' ? (p.engineer?.full_name || p.engineer?.username) : p.job?.title}
              </p>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem'}}>
                {role === 'company' ? `Role: ${p.job?.title}` : `Agency: ${p.job?.company?.company_name}`}
              </p>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.75rem'}}>
                <span style={{
                  background: p.status === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : p.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: p.status === 'accepted' ? 'var(--success)' : p.status === 'pending' ? 'var(--warning)' : 'var(--error)',
                  fontSize: '0.65rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  border: `1px solid ${p.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' : p.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  {p.status}
                </span>
                {role === 'company' && (
                  <span className="neuron-req">NeuronScore: {p.engineer?.neuron_score}</span>
                )}
              </div>
            </div>

            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              {role === 'company' && p.status === 'pending' && (
                <button 
                  className="btn-primary" 
                  style={{fontSize: '0.75rem', padding: '0.5rem 1.25rem'}}
                  onClick={() => handleAccept(p.id)}
                  disabled={!!loading}
                >
                  {loading === p.id ? 'Starting...' : 'Accept & Hire'}
                </button>
              )}
              <Link 
                href={role === 'company' ? `/engineer/${p.engineer?.username}` : `/jobs/${p.job_id}`}
                className="btn-secondary" 
                style={{fontSize: '0.75rem', padding: '0.5rem 1rem'}}
              >
                Profile Details
              </Link>
            </div>
          </div>
        ))}
        {proposals.length === 0 && (
          <div style={{textAlign: 'center', padding: '3rem', color: 'var(--on-surface-variant)', border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)'}}>
            No active proposals in this pipeline.
          </div>
        )}
      </div>
    </div>
  )
}
