'use client'

import { GlowingChart } from './GlowingChart'

interface CinematicAnalyticsProps {
  role: 'company' | 'engineer'
  data: {
    proposalsCount: number
    contractsCount: number
    matchesCount?: number
    invitationsCount?: number
    neuronScore?: number
    jobCount?: number
  }
}

export function CinematicAnalytics({ role, data }: CinematicAnalyticsProps) {
  // Simulated trend data for cinematic effect
  const trends = {
    score: [65, 68, 72, 70, 75, 82, 85],
    market: [20, 35, 25, 45, 60, 55, 75],
    engagement: [5, 12, 8, 15, 22, 18, 25]
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
      
      {/* Primary Metric: Performance / Quality */}
      <div className="glass-card-premium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
        <div>
          <h3 style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>
            {role === 'engineer' ? 'Technical Authority' : 'Talent Ecosystem'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
              {role === 'engineer' ? data.neuronScore : (data.matchesCount || 0) + (data.proposalsCount || 0)}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 700 }}>+12%</span>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <GlowingChart data={trends.score} label={role === 'engineer' ? "NeuronScore Velocity" : "Market Reach"} color="var(--primary)" />
        </div>
      </div>

      {/* Secondary Metric: Activity */}
      <div className="glass-card-premium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
        <div>
          <h3 style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>
             {role === 'engineer' ? 'Growth Trajectory' : 'Deployment Velocity'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
              {role === 'engineer' ? data.proposalsCount : data.jobCount}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>{role === 'engineer' ? 'ACTIVE APPLICATIONS' : 'OPEN ROLES'}</span>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <GlowingChart data={trends.market} label="Engagement Density" color="var(--secondary)" />
        </div>
      </div>

      {/* Tertiary Metric: Converged Work */}
      <div className="glass-card-premium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
        <div>
          <h3 style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>
            Resource Convergence
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
              {data.contractsCount}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>VERIFIED</span>
               <span style={{ fontSize: '0.6rem', color: 'var(--on-surface-variant)', opacity: 0.6 }}>ACTIVE SESSIONS</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <GlowingChart data={trends.engagement} label={role === 'engineer' ? "Income Velocity" : "Budget Burn"} color="var(--error)" />
        </div>
      </div>

    </div>
  )
}
