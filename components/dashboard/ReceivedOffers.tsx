'use client'

import { useState } from 'react'
import { respondToInvitation } from '@/app/dashboard/actions'

interface Invitation {
  id: string
  message: string
  created_at: string
  company: {
    company_name: string
    industry: string
  }
  job?: {
    title: string
  }
  bounty?: {
    title: string
  }
}

interface ReceivedOffersProps {
  invitations: Invitation[]
}

export function ReceivedOffers({ invitations }: ReceivedOffersProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleResponse(id: string, status: 'accepted' | 'declined') {
    const confirmMsg = status === 'accepted' 
      ? 'Accepting this offer will notify the company that you are ready for the final handshake. Proceed?'
      : 'Are you sure you want to decline this high-stakes opportunity?'
    
    if (!confirm(confirmMsg)) return

    setLoading(id)
    const res = await respondToInvitation(id, status)
    setLoading(null)
    
    if (res.error) alert(res.error)
    else {
      alert(status === 'accepted' ? 'Handshake initiated! The company has been notified.' : 'Offer declined.')
    }
  }

  if (invitations.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--outline-variant)' }}>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
          No high-stakes invitations received yet. Improve your NeuronScore to attract elite agencies.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-section-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        Received Offers <span className="glass-badge glass-badge--available">{invitations.length} New</span>
      </div>
      
      {invitations.map((inv) => (
        <div key={inv.id} className="glass-card-premium" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>{inv.company.company_name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>{inv.company.industry}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontWeight: 800 }}>
                {new Date(inv.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
            <p style={{ fontSize: '0.9rem', color: '#fff', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              "{inv.message}"
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.85rem' }}>
              Regarding: <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>{inv.job?.title || inv.bounty?.title || 'General Outreach'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => handleResponse(inv.id, 'accepted')}
                disabled={!!loading}
                className="btn-primary" 
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}
              >
                {loading === inv.id ? 'Processing...' : 'Accept Handshake'}
              </button>
              <button 
                onClick={() => handleResponse(inv.id, 'declined')}
                disabled={!!loading}
                className="btn-secondary" 
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
