import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get the role from user metadata
  const role = user.user_metadata?.role || 'engineer'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to your Dashboard</h1>
        <p>Logged in as: {user.email}</p>
        <p style={{color: 'var(--primary)'}}>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
      </div>

      <div className="grid-2">
        <div className="stat-card" style={{gridColumn: '1/3', display: 'flex', justifyContent: 'center',flexDirection: 'column',alignItems: 'center', padding: '3rem', border: '1px solid var(--outline-variant)'}}>
          <h2 style={{color: 'var(--on-surface-variant)'}}>Pending Database Setup</h2>
          <p style={{textAlign: 'center', maxWidth: 600, marginTop: '1rem'}}>
            Currently, we do not have real user profile data to display because the Supabase database migrations have not been run, and your `.env.local` Supabase keys need to be configured. 
          </p>
        </div>
      </div>
    </div>
  )
}
