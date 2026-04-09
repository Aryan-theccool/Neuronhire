import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CompanyForms } from '@/components/dashboard/CompanyForms'
import { EngineerForms } from '@/components/dashboard/EngineerForms'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.user_metadata?.role || 'engineer'
  let profile = null;
  let projects: any[] = [];

  if (role === 'company') {
    const { data } = await supabase.from('companies').select('*').eq('id', user.id).single()
    profile = data
  } else {
    const { data: pData } = await supabase.from('engineers').select('*').eq('id', user.id).single()
    profile = pData
    const { data: projData } = await supabase.from('projects').select('*').eq('engineer_id', user.id).order('created_at', { ascending: false })
    projects = projData || []
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to your Dashboard</h1>
        <p>Logged in as: {user.email}</p>
        <p style={{color: 'var(--primary)'}}>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
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
            {role === 'company' ? <CompanyForms /> : <EngineerForms profile={profile} projects={projects} />}
        </div>
      </div>
    </div>
  )
}
