import NeuronScoreRing from '@/components/profile/NeuronScoreRing'
import SkillBadge from '@/components/profile/SkillBadge'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import HireButtons from '@/components/profile/HireButtons'

export const revalidate = 60; // Cache for 1 minute

export default async function EngineerProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  const isSelf = user?.user_metadata?.username === username
  
  let isCompany = false
  if (user) {
    const { data: company } = await supabase.from('companies').select('id').eq('id', user.id).single()
    isCompany = !!company
  }

  // Fetch engineer profile
  const { data: engineer, error } = await supabase
    .from('engineers')
    .select(`
      *,
      projects(*),
      skill_badges(*)
    `)
    .eq('username', username)
    .single();

  if (error || !engineer) {
    notFound();
  }

  const projects = engineer.projects || [];
  const badges = engineer.skill_badges || [];


  return (
    <div className="page-container">
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-avatar">
            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, var(--primary-dim), var(--primary))',color:'#000',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'2.5rem'}}>
              {engineer.full_name[0]}
            </div>
          </div>
          <NeuronScoreRing score={engineer.neuron_score} size={160} breakdown={{projects:280,assessments:160,ratings:200,marketplace:150,community:150}} />
          <div style={{textAlign:'center'}}>
            <span style={{color:'var(--secondary)',fontFamily:'var(--font-display)',fontWeight:600}}>
              {engineer.hourly_rate_inr ? '\u20B9' + engineer.hourly_rate_inr + '/hr' : ''}
            </span>
          </div>
        </div>
        <div className="profile-hero__right">
          <h1>{engineer.full_name}</h1>
          <p style={{color:'var(--on-surface-variant)',fontSize:'0.9rem'}}>@{engineer.username} · {engineer.location}</p>
          <p className="profile-bio">{engineer.bio}</p>
          <p className="profile-philosophy">&quot;{engineer.ai_philosophy}&quot;</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            {(engineer.ai_stack || []).map((s: string) => <span key={s} className="stack-chip">{s}</span>)}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            {badges.map((b: any) => <SkillBadge key={b.badge_type} badge_type={b.badge_type} verified={b.verified} />)}
          </div>
          <div className="profile-links">
            {engineer.github_url && <a href={engineer.github_url} target="_blank" rel="noopener">GitHub</a>}
            {engineer.linkedin_url && <a href={engineer.linkedin_url} target="_blank" rel="noopener">LinkedIn</a>}
          </div>
        </div>
        <aside style={{flex: 1}}>
          {isSelf && (
            <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--primary)'}}>
              <h3 style={{marginBottom: '0.5rem'}}>Your Profile</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>
                Keep your portfolio updated to maintain a high NeuronScore.
              </p>
              <Link href="/dashboard" className="btn-primary" style={{display: 'block', textAlign: 'center', textDecoration: 'none'}}>
                Edit Portfolio
              </Link>
            </div>
          )}

          {isCompany && (
            <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--primary-container)', border: '1px solid var(--primary)'}}>
              <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Recruit Talent</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>
                Interested in working with {engineer.full_name || engineer.username}?
              </p>
              <HireButtons username={engineer.username} />
            </div>
          )}

          <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>NeuronScore™</h3>
            <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)', textAlign: 'center'}}>
              {engineer.neuron_score}
            </div>
            <p style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '0.5rem'}}>
              Ranking: Top 5% AI Talent
            </p>
          </div>

          <div className="card" style={{padding: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Details</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'block'}}>LOCATION</label>
                <div style={{fontWeight: 600}}>{engineer.location || 'Remote'}</div>
              </div>
              <div>
                <label style={{fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'block'}}>AVAILABILITY</label>
                <div style={{fontWeight: 600, color: '#4CAF50'}}>{engineer.is_available ? 'Ready for Hire' : 'Busy'}</div>
              </div>
              <div>
                <label style={{fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'block'}}>RATE</label>
                <div style={{fontWeight: 600}}>{engineer.hourly_rate_inr ? `${formatCurrency(engineer.hourly_rate_inr)} / hr` : 'Negotiable'}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <h2 className="section-title">Case Studies</h2>
      {projects.map((p: any) => (
        <div key={p.title} className="project-case-study">
          <h3>{p.title}</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.375rem',marginBottom:'1rem'}}>
            {(p.tech_stack || []).map((s: string) => <span key={s} className="stack-chip stack-chip--sm">{s}</span>)}
          </div>
          <div className="case-study-section"><h4>Problem</h4><p>{p.problem}</p></div>
          <div className="case-study-section"><h4>Approach</h4><p>{p.approach}</p></div>
          <div className="case-study-section"><h4>Outcome</h4><p>{p.outcome}</p></div>
        </div>
      ))}
    </div>
  )
}
