import JobCard from '@/components/hiring/JobCard'
import { createClient } from '@/lib/supabase/server'
import { SAMPLE_JOBS } from '@/lib/samples'

export const revalidate = 0; // Disable caching so it always gets the latest DB data

export default async function JobsPage() {
  const supabase = await createClient()
  
  // Join with the companies table to get the company_name
  const { data: dbJobs, error } = await supabase
    .from('job_postings')
    .select('*, company:companies(company_name, logo_url)')
    .order('created_at', { ascending: false })

  // Inject samples if DB is empty for demo "Wow" factor
  const displayJobs = (dbJobs && dbJobs.length > 0) ? dbJobs : SAMPLE_JOBS;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Jobs & Contracts</h1>
        <p>Find your next AI role — full-time, internship, hourly, or project-based.</p>
      </div>
      <div className="sidebar-layout">
        <aside className="filters">
          <div className="filter-group">
            <h3>Engagement Type</h3>
            {['Full-time','Internship','Hourly','Project'].map(t => (
              <label key={t} className="filter-option">
                <input type="checkbox" defaultChecked /> {t}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Skills</h3>
            {['Python','LangChain','PyTorch','RAG','MLOps','AutoGen'].map(s => (
              <label key={s} className="filter-option">
                <input type="checkbox" /> {s}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Min NeuronScore</h3>
            <input type="range" min="0" max="1000" step="100" defaultValue="0"
              style={{width:'100%', accentColor: 'var(--primary)'}} />
          </div>
        </aside>
        <div className="grid-2">
          {displayJobs.length > 0 ? (
            displayJobs.map((j: any) => <JobCard key={j.id} job={j} />)
          ) : (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)'}}>
              <p style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🤖</p>
              <p style={{fontWeight: 600}}>No jobs posted yet.</p>
              <p style={{marginTop: '0.5rem'}}>Be the first — post a job from your Dashboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
