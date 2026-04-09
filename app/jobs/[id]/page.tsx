import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApplyForm from '@/components/hiring/ApplyForm'
import { formatCurrency } from '@/lib/utils'
import TalentSuggestions from '@/components/hiring/TalentSuggestions'

export const revalidate = 60

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch job with company info
  const { data: job, error } = await supabase
    .from('job_postings')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Check if current user is an engineer to show application form
  const { data: { user } } = await supabase.auth.getUser()
  let isEngineer = false
  let isOwner = false

  if (user) {
    // Check if engineer
    const { data: engineer } = await supabase
      .from('engineers')
      .select('id')
      .eq('id', user.id)
      .single()
    isEngineer = !!engineer

    // Check if owner
    isOwner = job.company_id === user.id
  }

  return (
    <div className="page-container">
      <div style={{marginBottom: '1.5rem'}}>
        <Link href="/jobs" className="nav__link" style={{fontSize: '0.9rem'}}>← Back to Jobs</Link>
      </div>

      <div className="sidebar-layout">
        <div style={{flex: 2}}>
          <div className="page-header" style={{textAlign: 'left', marginBottom: '2rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
              {job.company.logo_url ? (
                <img src={job.company.logo_url} alt={job.company.company_name} style={{width: 64, height: 64, borderRadius: 8}} />
              ) : (
                <div style={{width: 64, height: 64, borderRadius: 8, background: 'var(--surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                  {job.company.company_name[0]}
                </div>
              )}
              <div>
                <h1 style={{fontSize: '2rem', marginBottom: '0.25rem'}}>{job.title}</h1>
                <p style={{color: 'var(--primary)', fontWeight: 600}}>{job.company.company_name}</p>
              </div>
            </div>

            <div style={{display: 'flex', gap: '1.5rem', marginTop: '1.5rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1.5rem'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase'}}>Budget</label>
                <div style={{fontWeight: 600}}>
                  {job.budget_min_inr ? `${formatCurrency(job.budget_min_inr)}` : 'Competitive'} 
                  {job.budget_max_inr ? ` - ${formatCurrency(job.budget_max_inr)}` : ''}
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase'}}>Type</label>
                <div style={{fontWeight: 600, textTransform: 'capitalize'}}>{job.engagement_type}</div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase'}}>Min NeuronScore</label>
                <div style={{fontWeight: 600, color: 'var(--secondary)'}}>{job.min_neuron_score}</div>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '3rem'}}>
            <h3 style={{marginBottom: '1rem'}}>About the Role</h3>
            <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--on-surface-variant)'}}>
              {job.description}
            </div>
          </div>

          <div style={{marginBottom: '3rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Skills Required</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
              {job.skills_required.map((skill: string) => (
                <span key={skill} className="stack-chip">{skill}</span>
              ))}
            </div>
          </div>

          {isOwner && (
            <TalentSuggestions 
              jobId={job.id} 
              skillsRequired={job.skills_required} 
              minNeuronScore={job.min_neuron_score} 
            />
          )}
        </div>

        <aside style={{flex: 1}}>
          {isOwner ? (
            <div className="card" style={{padding: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>Manage Posting</h3>
              <p style={{fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem'}}>
                You are the owner of this job posting. You can view candidates and suggestions here.
              </p>
              <button className="btn-secondary" style={{width: '100%', marginBottom: '0.5rem'}}>Edit Job</button>
              <button className="btn-primary" style={{width: '100%', background: 'var(--error)', borderColor: 'var(--error)', color: '#000'}}>Close Job</button>
            </div>
          ) : isEngineer ? (
            <ApplyForm jobId={job.id} />
          ) : (
            <div className="card" style={{padding: '1.5rem', textAlign: 'center'}}>
              <h3 style={{marginBottom: '1rem'}}>Interested?</h3>
              <p style={{fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem'}}>
                Join as an Engineer to apply for this role and showcase your NeuronScore.
              </p>
              <Link href="/signup" className="btn-primary" style={{display: 'block', width: '100%'}}>Join as Engineer</Link>
            </div>
          )}
          
          <div className="card" style={{padding: '1.5rem', marginTop: '1.5rem', background: 'transparent', border: '1px dashed var(--outline)'}}>
            <h4 style={{marginBottom: '0.75rem'}}>About {job.company.company_name}</h4>
            <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>
              {job.company.industry} · {job.company.size} employees
            </p>
            {job.company.website && (
              <a href={job.company.website} target="_blank" rel="noopener" className="nav__link" style={{fontSize: '0.85rem', color: 'var(--primary)'}}>
                Visit Website ↗
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
