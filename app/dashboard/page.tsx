import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CompanyForms } from '@/components/dashboard/CompanyForms'
import { EngineerForms } from '@/components/dashboard/EngineerForms'
import NotificationCenter from '@/components/notifications/NotificationCenter'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.user_metadata?.role || 'engineer'
  let profile = null;
  let projects: any[] = [];
  let proposals: any[] = [];
  let contracts: any[] = [];

  if (role === 'company') {
    const { data } = await supabase.from('companies').select('*').eq('id', user.id).single()
    profile = data
    
    // Fetch proposals for jobs owned by company
    const { data: propData } = await supabase
      .from('proposals')
      .select('*, job:job_postings!inner(title, company_id), engineer:engineers(username, full_name, neuron_score)')
      .eq('job.company_id', user.id)
    proposals = propData || []

    const { data: contData } = await supabase
      .from('contracts')
      .select('*, job:job_postings(title), engineer:engineers(username, full_name)')
      .eq('company_id', user.id)
    contracts = contData || []

  } else {
    const { data: pData } = await supabase.from('engineers').select('*').eq('id', user.id).single()
    profile = pData
    
    const { data: projData } = await supabase.from('projects').select('*').eq('engineer_id', user.id).order('created_at', { ascending: false })
    projects = projData || []

    // Fetch athlete's own applications
    const { data: propData } = await supabase
      .from('proposals')
      .select('*, job:job_postings(title, company:companies(company_name))')
      .eq('engineer_id', user.id)
    proposals = propData || []

    const { data: contData } = await supabase
      .from('contracts')
      .select('*, job:job_postings(title), company:companies(company_name)')
      .eq('engineer_id', user.id)
    contracts = contData || []
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1>Welcome to your Dashboard</h1>
            <p>Logged in as: {user.email}</p>
            <p style={{color: 'var(--primary)'}}>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
             <NotificationCenter />
             <button className="btn-secondary">Settings</button>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="stat-card">
          <h2 style={{color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>Profile Status</h2>
          {profile ? (
            <div style={{background: 'rgba(0,255,0,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,255,0,0.3)'}}>
              <h3 style={{color: '#4ade80'}}>✅ Connected</h3>
              <p>Your Supabase profile is active.</p>
            </div>
          ) : (
            <div style={{background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)'}}>
              <h3 style={{color: '#f87171'}}>⚠️ Profile Not Found</h3>
              <p>Please re-run the Auth triggers in Database.</p>
            </div>
          )}
        </div>

        {/* Action Panel based on Role */}
        <div style={{gridColumn: '1 / -1', marginTop: '2rem'}}>
            {role === 'company' ? (
              <CompanyForms profile={profile} proposals={proposals} contracts={contracts} />
             ) : (
              <EngineerForms profile={profile} projects={projects} proposals={proposals} contracts={contracts} />
            )}
        </div>
      </div>
    </div>
  )
}
