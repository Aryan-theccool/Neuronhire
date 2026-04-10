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
              {engineer.full_name?.[0] || engineer.username[0].toUpperCase()}
            </div>
          </div>
          <NeuronScoreRing score={engineer.neuron_score} size={160} breakdown={{projects:280,assessments:160,ratings:200,marketplace:150,community:150}} />
          <div style={{textAlign:'center'}}>
            <span style={{color:'var(--secondary)',fontFamily:'var(--font-display)',fontWeight:600}}>
              {engineer.hourly_rate_inr ? '\u20B9' + engineer.hourly_rate_inr + '/hr' : engineer.hourly_rate ? '$' + engineer.hourly_rate + '/hr' : 'Negotiable'}
            </span>
          </div>
        </div>
        <div className="profile-hero__right">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.25rem'}}>
            <h1 style={{margin: 0}}>{engineer.full_name}</h1>
            <span className="glass-badge" style={{background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)'}}>{engineer.skill_level || 'Expert'}</span>
          </div>
          <p style={{color:'var(--on-surface-variant)',fontSize:'0.9rem'}}>@{engineer.username} · {engineer.location}</p>
          
          <div style={{marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
             {(engineer.domain_expertise || []).map((d: string) => (
               <span key={d} style={{padding: '0.375rem 0.75rem', background: 'rgba(204, 151, 255, 0.12)', border: '1px solid rgba(204, 151, 255, 0.25)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em'}}>
                 {d.toUpperCase()}
               </span>
             ))}
          </div>

          <p className="profile-bio" style={{marginTop: '1.5rem'}}>{engineer.bio || 'Experienced AI engineer building next-gen neural architectures and autonomous agents.'}</p>
          
          <div className="tech-stack-layers" style={{marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {engineer.primary_languages?.length > 0 && (
              <div>
                <label style={{fontSize: '0.65rem', color: 'var(--on-surface-variant)', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>LANGUAGES</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.375rem'}}>
                  {engineer.primary_languages.map((s: string) => <span key={s} className="stack-chip">{s}</span>)}
                </div>
              </div>
            )}
            {engineer.frameworks?.length > 0 && (
              <div>
                <label style={{fontSize: '0.65rem', color: 'var(--on-surface-variant)', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>FRAMEWORKS & TOOLS</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.375rem'}}>
                  {engineer.frameworks.map((s: string) => <span key={s} className="stack-chip" style={{borderColor: 'rgba(173, 198, 255, 0.3)', color: 'var(--primary)'}}>{s}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="profile-links" style={{marginTop: '2rem'}}>
            {engineer.github_url && <a href={engineer.github_url} target="_blank" rel="noopener" className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>GitHub</a>}
            {engineer.linkedin_url && <a href={engineer.linkedin_url} target="_blank" rel="noopener" className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>LinkedIn</a>}
          </div>
        </div>
        <aside style={{flex: 1, minWidth: '280px'}}>
          {isSelf && (
            <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--primary)', background: 'rgba(173, 198, 255, 0.05)'}}>
              <h3 style={{marginBottom: '0.5rem'}}>Your Profile</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>
                Maintain your NeuronScore by participating in bounties and adding case studies.
              </p>
              <Link href="/dashboard" className="btn-primary" style={{display: 'block', textAlign: 'center', textDecoration: 'none'}}>
                Manage Portfolio
              </Link>
            </div>
          )}

          {isCompany && (
            <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--primary-container)', border: '1px solid var(--primary)'}}>
              <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Direct Hire</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>
                Book {engineer.full_name?.split(' ')[0] || 'Talent'} for specialized AI projects.
              </p>
              <HireButtons username={engineer.username} />
            </div>
          )}

          <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem', fontSize: '0.9rem'}}>NeuronScore™</h3>
            <div style={{fontSize: '3.5rem', fontWeight: 900, color: 'var(--secondary)', textAlign: 'center', letterSpacing: '-0.05em'}}>
              {engineer.neuron_score}
            </div>
            <p style={{textAlign: 'center', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
              Verified AI Talent
            </p>
          </div>

          <div className="card" style={{padding: '1.5rem'}}>
            <h3 style={{marginBottom: '1.25rem', fontSize: '0.9rem'}}>Vitals</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              <div>
                <label style={{fontSize: '0.65rem', color: 'var(--on-surface-variant)', display: 'block', fontWeight: 700, letterSpacing: '0.05em'}}>LOCATION</label>
                <div style={{fontWeight: 600, fontSize: '0.9rem'}}>{engineer.location || 'Remote'}</div>
              </div>
              <div>
                <label style={{fontSize: '0.65rem', color: 'var(--on-surface-variant)', display: 'block', fontWeight: 700, letterSpacing: '0.05em'}}>TYPE</label>
                <div style={{fontWeight: 600, fontSize: '0.9rem', color: '#4CAF50'}}>{engineer.work_preferences?.work_type === 'full-time' ? 'Full-time' : 'Freelance'}</div>
              </div>
              <div>
                <label style={{fontSize: '0.65rem', color: 'var(--on-surface-variant)', display: 'block', fontWeight: 700, letterSpacing: '0.05em'}}>AVAILABILITY</label>
                <div style={{fontWeight: 600, fontSize: '0.9rem'}}>{engineer.is_available ? 'Immediate' : 'In 2 Weeks'}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <h2 className="section-title" style={{marginTop: '4rem'}}>Technical Case Studies</h2>
      <div className="grid-2">
        {projects.map((p: any) => (
          <div key={p.title} className="project-case-study" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <h3 style={{margin: 0}}>{p.title}</h3>
              {p.github_url && <a href={p.github_url} target="_blank" rel="noopener" style={{fontSize: '1.25rem'}}>󰊤</a>}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.375rem',marginBottom:'1.5rem'}}>
              {(p.tech_stack || []).map((s: string) => <span key={s} className="stack-chip stack-chip--sm">{s}</span>)}
            </div>
            <div className="case-study-section">
              <h4 style={{fontSize: '0.7rem', color: 'var(--primary-dim)'}}>THE PROBLEM</h4>
              <p style={{fontSize: '0.875rem', color: 'var(--on-surface-variant)'}}>{p.problem}</p>
            </div>
            <div className="case-study-section" style={{marginTop: 'auto', paddingTop: '1rem'}}>
              <h4 style={{fontSize: '0.7rem', color: 'var(--secondary)'}}>IMPACT / OUTCOME</h4>
              <p style={{fontSize: '0.875rem', color: 'var(--on-surface)'}}>{p.outcome}</p>
            </div>
            {p.demo_url && (
              <a href={p.demo_url} target="_blank" rel="noopener" className="btn-secondary" style={{width: '100%', marginTop: '1.5rem', fontSize: '0.75rem'}}>
                View Live Demo
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
