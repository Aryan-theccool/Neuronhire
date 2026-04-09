'use client'

import { formatCurrency } from '@/lib/utils'

interface ContractListProps {
  contracts: any[]
  role: 'company' | 'engineer'
}

export function ContractList({ contracts, role }: ContractListProps) {
  return (
    <div className="stat-card">
      <h3 style={{marginBottom: '1.5rem'}}>Active Work ({contracts.length})</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        {contracts.map(c => (
          <div key={c.id} style={{
            padding: '1.25rem',
            background: 'var(--surface-container-low)',
            borderRadius: '12px',
            border: '1px solid var(--outline-variant)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div>
                <h4 style={{fontSize: '1.1rem', marginBottom: '0.25rem'}}>{c.job?.title}</h4>
                <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
                  {role === 'company' ? `Talent: ${c.engineer?.full_name || c.engineer?.username}` : `With: ${c.company?.company_name}`}
                </p>
              </div>
              <span className="status-badge" style={{
                background: 'rgba(var(--primary-rgb), 0.1)',
                color: 'var(--primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: '2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {c.status}
              </span>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
               <div>
                  <div style={{fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.25rem'}}>CONTRACT VALUE</div>
                  <div style={{fontWeight: 700, color: 'var(--secondary)'}}>{formatCurrency(c.total_inr)}</div>
               </div>
               <div style={{display: 'flex', gap: '0.5rem'}}>
                  {role === 'company' ? (
                    <button className="btn-primary" style={{fontSize: '0.8rem', padding: '0.5rem 1rem'}}>Release Payment</button>
                  ) : (
                    <button className="btn-secondary" style={{fontSize: '0.8rem', padding: '0.5rem 1rem'}}>Submit Milestone</button>
                  )}
               </div>
            </div>
          </div>
        ))}
        {contracts.length === 0 && (
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--on-surface-variant)', background: 'var(--surface-variant)', borderRadius: '8px'}}>
            <p style={{fontSize: '0.9rem'}}>No active work in progress.</p>
          </div>
        )}
      </div>
    </div>
  )
}
