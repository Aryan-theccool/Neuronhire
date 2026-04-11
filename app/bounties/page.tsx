import BountyCard from '@/components/hiring/BountyCard'
import { createClient } from '@/lib/supabase/server'
import { SAMPLE_BOUNTIES } from '@/lib/samples'

export const revalidate = 0;

export default async function BountiesPage() {
  const supabase = await createClient()

  const { data: dbBounties, error } = await supabase
    .from('bounties')
    .select('*, company:companies(company_name, logo_url)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Bounty Board Fetch Error:', error.message, error.details)
  }

  // Hybrid Feed: Mix real bounties with premium samples
  const displayBounties = [
    ...(dbBounties || []),
    ...SAMPLE_BOUNTIES
  ].slice(0, 8);

  return (
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <header className="cinema-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <h1>Open AI Bounties</h1>
          <div className="count-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <span className="pulse-dot" style={{ background: 'var(--warning)', boxShadow: '0 0 10px var(--warning)' }} />
            <span style={{ color: 'var(--warning)', fontWeight: 700 }}>{displayBounties.length} active tasks</span>
          </div>
        </div>
        <p className="subtitle" style={{ maxWidth: '750px', fontSize: '1.1rem', opacity: 0.8 }}>
          Solve the frontier's most complex AI problems. Earn verified reputation and high-stakes financial rewards.
        </p>
      </header>
      <div className="grid-2">
        {displayBounties.length > 0 ? (
          displayBounties.map((b: any) => <BountyCard key={b.id} bounty={b} />)
        ) : (
          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)'}}>
            <p style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💰</p>
            <p style={{fontWeight: 600}}>No bounties open yet.</p>
            <p style={{marginTop: '0.5rem'}}>Launch an AI bounty from your Company Dashboard!</p>
          </div>
        )}
      </div>
    </div>
  )
}
