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
    <div className="page-container" style={{paddingTop: '3rem'}}>
      <div style={{marginBottom: '2.5rem'}}>
        <Link href="/bounties" className="btn-secondary" style={{fontSize: '0.8rem'}}>
          ← Back to Bounty Board
        </Link>
      </div>

      <div className="sidebar-layout">
        <div style={{flex: 2}}>
          <div className="glass-card" style={{padding: '3rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem'}}>
              <div>
                <h1 style={{fontSize: '2.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', lineHeight: 1.1}}>{bounty.title}</h1>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <span style={{color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem'}}>{bounty.company.company_name}</span>
                  <span style={{
                    background: bounty.status === 'open' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: bounty.status === 'open' ? 'var(--success)' : 'var(--warning)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: `1px solid ${bounty.status === 'open' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                  }}>
                    {bounty.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{gap: '3rem', marginBottom: '3rem', padding: '2rem', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(64, 72, 93, 0.1)'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.75rem'}}>Bounty Reward</label>
                <div style={{fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-display)'}}>
                  {formatCurrency(bounty.reward_inr)}
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.75rem'}}>Submission Deadline</label>
                <div style={{fontSize: '1.25rem', fontWeight: 700, color: isExpired ? 'var(--error)' : 'var(--on-surface)'}}>
                  {deadline ? deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Indefinite'}
                  {isExpired && ' (Expired)'}
                </div>
              </div>
            </div>

            <div className="form-section" style={{marginBottom: '3rem'}}>
              <div className="form-section-title">Technical Problem Statement</div>
              <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--on-surface-variant)', fontSize: '1rem'}}>
                {bounty.problem_description}
              </div>
            </div>

            {bounty.expected_output && (
              <div className="form-section" style={{marginBottom: '3rem', borderLeft: '3px solid var(--secondary)'}}>
                <div className="form-section-title" style={{color: 'var(--secondary)', borderLeft: 'none', paddingLeft: 0}}>Expected Deliverables</div>
                <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--on-surface-variant)', fontSize: '0.95rem'}}>
                  {bounty.expected_output}
                </div>
              </div>
            )}

            <div>
              <div className="form-section-title">Target Stack</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
                {bounty.skills_needed.map((skill: string) => (
                  <span key={skill} className="stack-chip" style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside style={{flex: 1}}>
          <div className="glass-card" style={{padding: '2rem', position: 'sticky', top: '7rem'}}>
            {bounty.status === 'open' && !isExpired ? (
              isEngineer ? (
                <>
                  <h3 style={{marginBottom: '1.5rem', fontFamily: 'var(--font-display)'}}>Submit Solution</h3>
                  <BountySubmissionForm bountyId={bounty.id} />
                </>
              ) : (
                <div style={{textAlign: 'center'}}>
                  <h3 style={{marginBottom: '1rem', fontFamily: 'var(--font-display)'}}>Want the Bounty?</h3>
                  <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem', lineHeight: 1.6}}>
                    Only verified Engineers can submit solutions. Your submission will be audited by the AI review pipeline.
                  </p>
                  <Link href="/auth/signup" className="btn-primary" style={{display: 'block', width: '100%'}}>Join to Solve</Link>
                </div>
              )
            ) : (
              <div style={{textAlign: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--error)'}}>
                <h3 style={{marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--error)'}}>Bounty Concluded</h3>
                <p style={{fontSize: '0.8rem', color: 'var(--on-surface-variant)'}}>
                  This opportunity is no longer accepting submissions.
                </p>
              </div>
            )}

            <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(64, 72, 93, 0.15)'}}>
              <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--on-surface-variant)'}}>Issuer</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: 32, height: 32, borderRadius: 6, background: 'var(--surface-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700}}>
                  {bounty.company.company_name[0]}
                </div>
                <div>
                  <p style={{fontSize: '0.85rem', fontWeight: 600}}>{bounty.company.company_name}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
