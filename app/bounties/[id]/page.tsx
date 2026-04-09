import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BountySubmissionForm from '@/components/hiring/BountySubmissionForm'
import { formatCurrency } from '@/lib/utils'

export const revalidate = 60

export default async function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch bounty with company info
  const { data: bounty, error } = await supabase
    .from('bounties')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single()

  if (error || !bounty) {
    notFound()
  }

  // Check if current user is an engineer
  const { data: { user } } = await supabase.auth.getUser()
  let isEngineer = false
  if (user) {
    const { data: engineer } = await supabase
      .from('engineers')
      .select('id')
      .eq('id', user.id)
      .single()
    isEngineer = !!engineer
  }

  const deadline = bounty.deadline ? new Date(bounty.deadline) : null
  const isExpired = deadline ? deadline < new Date() : false

  return (
    <div className="page-container">
      <div style={{marginBottom: '1.5rem'}}>
        <Link href="/bounties" className="nav__link" style={{fontSize: '0.9rem'}}>← Back to Bounties</Link>
      </div>

      <div className="sidebar-layout">
        <div style={{flex: 2}}>
          <div className="page-header" style={{textAlign: 'left', marginBottom: '2rem'}}>
            <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>{bounty.title}</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{color: 'var(--primary)', fontWeight: 600}}>{bounty.company.company_name}</span>
              <span style={{color: 'var(--outline)'}}>•</span>
              <span style={{
                background: bounty.status === 'open' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                color: bounty.status === 'open' ? '#4CAF50' : '#FF9800',
                padding: '0.2rem 0.6rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {bounty.status}
              </span>
            </div>

            <div style={{display: 'flex', gap: '2rem', marginTop: '2rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '2rem'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase'}}>Reward</label>
                <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)'}}>
                  {formatCurrency(bounty.reward_inr)}
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase'}}>Deadline</label>
                <div style={{fontWeight: 600, color: isExpired ? 'var(--error)' : 'inherit'}}>
                  {deadline ? deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline'}
                  {isExpired && ' (Expired)'}
                </div>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '3rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Problem Description</h3>
            <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--on-surface-variant)'}}>
              {bounty.problem_description}
            </div>
          </div>

          {bounty.expected_output && (
            <div style={{marginBottom: '3rem'}}>
              <h3 style={{marginBottom: '1rem'}}>Expected Output</h3>
              <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--on-surface-variant)', background: 'var(--surface-variant)', padding: '1.5rem', borderRadius: '0.5rem'}}>
                {bounty.expected_output}
              </div>
            </div>
          )}

          <div style={{marginBottom: '3rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Skills Needed</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
              {bounty.skills_needed.map((skill: string) => (
                <span key={skill} className="stack-chip">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <aside style={{flex: 1}}>
          {bounty.status === 'open' && !isExpired ? (
            isEngineer ? (
              <BountySubmissionForm bountyId={bounty.id} />
            ) : (
              <div className="card" style={{padding: '1.5rem', textAlign: 'center'}}>
                <h3 style={{marginBottom: '1rem'}}>Want to Solve This?</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem'}}>
                  Join as an Engineer to submit your solution and win the {formatCurrency(bounty.reward_inr)} reward.
                </p>
                <Link href="/signup" className="btn-primary" style={{display: 'block', width: '100%'}}>Join as Engineer</Link>
              </div>
            )
          ) : (
            <div className="card" style={{padding: '1.5rem', textAlign: 'center', background: 'var(--surface-variant)'}}>
              <h3 style={{marginBottom: '0.5rem'}}>Submissions Closed</h3>
              <p style={{fontSize: '0.9rem', color: 'var(--on-surface-variant)'}}>
                This bounty is either completed or the deadline has passed.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
