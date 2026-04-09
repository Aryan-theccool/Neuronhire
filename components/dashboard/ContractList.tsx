'use client'

import { formatCurrency } from '@/lib/utils'

interface ContractListProps {
  contracts: any[]
  role: 'company' | 'engineer'
}

export function ContractList({ contracts, role }: ContractListProps) {
  return (
    <div className="glass-card" style={{padding: '2rem'}}>
      <div className="form-section-title" style={{marginBottom: '2rem'}}>
        Live Engagement Tracking
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        {contracts.map(c => (
          <div key={c.id} style={{
            padding: '1.5rem',
            background: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--outline-variant)',
            transition: 'all 0.3s ease'
          }} className="hover:border-primary">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
              <div>
                <h4 style={{fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--on-surface)', fontFamily: 'var(--font-display)'}}>{c.job?.title}</h4>
                <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
                  {role === 'company' ? `Talent Assigned: ${c.engineer?.full_name || c.engineer?.username}` : `Collaborating with: ${c.company?.company_name}`}
                </p>
              </div>
              <span style={{
                background: 'rgba(204, 151, 255, 0.1)',
                color: 'var(--primary)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid rgba(204, 151, 255, 0.2)'
              }}>
                {c.status}
              </span>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid rgba(64, 72, 93, 0.1)'}}>
               <div>
                  <div style={{fontSize: '0.65rem', color: 'var(--on-surface-variant)', marginBottom: '0.375rem', fontWeight: 700, letterSpacing: '0.05em'}}>ESCROW BALANCE</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'var(--font-display)'}}>{formatCurrency(c.total_inr)}</div>
               </div>
               <div style={{display: 'flex', gap: '1rem'}}>
                  {role === 'company' ? (
                    <button className="btn-primary" style={{fontSize: '0.75rem', padding: '0.625rem 1.25rem'}}>Release Payment</button>
                  ) : (
                    <button className="btn-secondary" style={{fontSize: '0.75rem', padding: '0.625rem 1.25rem'}}>Submit Milestone</button>
                  )}
               </div>
            </div>
          </div>
        ))}
        {contracts.length === 0 && (
          <div style={{textAlign: 'center', padding: '3rem', color: 'var(--on-surface-variant)', border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)'}}>
            <p style={{fontSize: '0.9rem'}}>No active work in progress yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
