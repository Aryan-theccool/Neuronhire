import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApplyForm from '@/components/hiring/ApplyForm'
import { formatCurrency } from '@/lib/utils'
import TalentSuggestions from '@/components/hiring/TalentSuggestions'

import { SAMPLE_JOBS } from '@/lib/samples'

export const revalidate = 60

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let job: any = null
  let isEngineer = false
  let isOwner = false

  // Handle Sample Data
  if (id.startsWith('sample-')) {
    job = SAMPLE_JOBS.find(j => j.id === id)
    if (!job) notFound()
  } else {
    // Fetch real job from Supabase
    const { data: dbJob, error } = await supabase
      .from('job_postings')
      .select('*, company:companies(*)')
      .eq('id', id)
      .single()

    if (error || !dbJob) notFound()
    job = dbJob

    // Check auth for real jobs
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: engineer } = await supabase
        .from('engineers')
        .select('id')
        .eq('id', user.id)
        .single()
      isEngineer = !!engineer
      isOwner = job.company_id === user.id
    }
  }

  return (
    <div className="page-container" style={{paddingTop: '3rem'}}>
      <div style={{marginBottom: '2.5rem'}}>
        <Link href="/jobs" className="btn-secondary" style={{fontSize: '0.8rem'}}>
          ← Back to Opportunity Marketplace
        </Link>
      </div>

      <div className="sidebar-layout">
        <div style={{flex: 2}}>
          <div className="glass-card" style={{padding: '3rem'}}>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '3rem'}}>
              {job.company.logo_url ? (
                <img src={job.company.logo_url} alt={job.company.company_name} style={{width: 80, height: 80, borderRadius: 12, border: '1px solid var(--outline-variant)'}} />
              ) : (
                <div style={{width: 80, height: 80, borderRadius: 12, background: 'linear-gradient(135deg, var(--surface-bright), var(--surface-container))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--primary)'}}>
                  {job.company.company_name[0]}
                </div>
              )}
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <h1 style={{fontSize: '2.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', lineHeight: 1.1}}>{job.title}</h1>
                    <p style={{color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem'}}>{job.company.company_name}</p>
                  </div>
                  <span className="skill-badge skill-badge--verified" style={{textTransform: 'uppercase', letterSpacing: '0.1em'}}>Open Role</span>
                </div>
                
                <div className="grid-3" style={{marginTop: '2rem', gap: '2rem'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem'}}>Budget Range</label>
                    <div style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'var(--font-display)'}}>
                      {job.budget_min_inr ? `${formatCurrency(job.budget_min_inr)}` : 'Competitive'} 
                      {job.budget_max_inr ? ` - ${formatCurrency(job.budget_max_inr)}` : ''}
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem'}}>Engagement</label>
                    <div style={{fontSize: '1.1rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--on-surface)'}}>{job.engagement_type}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem'}}>NeuronScore Required</label>
                    <div style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)'}}>{job.min_neuron_score}+</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section" style={{marginBottom: '3rem'}}>
              <div className="form-section-title">Mission Overview</div>
              <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--on-surface-variant)', fontSize: '1rem'}}>
                {job.description}
              </div>
            </div>

            <div>
              <div className="form-section-title">Required AI Specializations</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
                {job.skills_required.map((skill: string) => (
                  <span key={skill} className="stack-chip" style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}>{skill}</span>
                ))}
              </div>
            </div>

            {isOwner && (
              <div style={{marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(64, 72, 93, 0.15)'}}>
                <TalentSuggestions 
                  jobId={job.id} 
                  skillsRequired={job.skills_required} 
                  minNeuronScore={job.min_neuron_score} 
                />
              </div>
            )}
          </div>
        </div>

        <aside style={{flex: 1}}>
          <div className="glass-card" style={{padding: '2rem', position: 'sticky', top: '7rem'}}>
            {isOwner ? (
              <>
                <h3 style={{marginBottom: '1rem', fontFamily: 'var(--font-display)'}}>Role Governance</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem', lineHeight: 1.6}}>
                  You are listing this opportunity. Monitor candidates and suggested talent in your dashboard.
                </p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <button className="btn-secondary" style={{width: '100%'}}>Modify Specification</button>
                  <button className="btn-primary" style={{width: '100%', background: 'rgba(255, 110, 132, 0.1)', border: '1px solid var(--error)', color: 'var(--error)'}}>Terminal Close Posting</button>
                </div>
              </>
            ) : isEngineer ? (
              <>
                <h3 style={{marginBottom: '1.5rem', fontFamily: 'var(--font-display)'}}>Apply for Role</h3>
                <ApplyForm jobId={job.id} />
              </>
            ) : (
              <div style={{textAlign: 'center'}}>
                <h3 style={{marginBottom: '1rem', fontFamily: 'var(--font-display)'}}>Ready to contribute?</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem', lineHeight: 1.6}}>
                  Create an Engineer profile to apply. Your AI expertise and NeuronScore will be shared with the company.
                </p>
                <Link href="/auth/signup" className="btn-primary" style={{display: 'block', width: '100%'}}>Join as Talent</Link>
              </div>
            )}
            
            <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(64, 72, 93, 0.15)'}}>
              <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--on-surface-variant)'}}>Company Ecosystem</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: 32, height: 32, borderRadius: 6, background: 'var(--surface-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700}}>
                  {job.company.company_name[0]}
                </div>
                <div>
                  <p style={{fontSize: '0.85rem', fontWeight: 600}}>{job.company.company_name}</p>
                  <p style={{fontSize: '0.75rem', color: 'var(--on-surface-variant)'}}>{job.company.industry}</p>
                </div>
              </div>
              {job.company.website && (
                <a href={job.company.website} target="_blank" rel="noopener" className="nav__link" style={{display: 'block', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--secondary)'}}>
                  Experience the Brand ↗
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
