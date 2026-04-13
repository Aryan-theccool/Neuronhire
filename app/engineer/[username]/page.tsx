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
    <div className="dossier-container">
      {/* SIDEBAR: NEURAL IDENTITY */}
      <aside className="dossier-sidebar">
        {/* AVATAR MODULE */}
        <div className="dossier-module" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="scanning-scanline" />
          <div className="profile-avatar" style={{ margin: '0 auto 1.5rem', width: 160, height: 160, border: '2px solid var(--primary)', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--surface-container), var(--primary-dim))', color: '#fff', fontSize: '3rem', fontWeight: 900 }}>
              {engineer.full_name?.[0] || engineer.username[0].toUpperCase()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="pulse-online" />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--success)' }}>NEURAL STATUS: ACTIVE</span>
          </div>
          <div className="dossier-metric" style={{ color: 'var(--primary)', fontSize: '2rem' }}>{engineer.neuron_score}</div>
          <div className="dossier-label" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>NEURONSCORE™</div>
        </div>

        {/* VITALS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="dossier-module">
            <div className="dossier-label">Rate</div>
            <div className="dossier-metric" style={{ fontSize: '1.25rem' }}>
              {engineer.hourly_rate_inr ? '₹' + engineer.hourly_rate_inr : engineer.hourly_rate ? '$' + engineer.hourly_rate : 'N/A'}
            </div>
          </div>
          <div className="dossier-module">
            <div className="dossier-label">Level</div>
            <div className="dossier-metric" style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>{engineer.skill_level || 'EXPERT'}</div>
          </div>
        </div>

        <div className="dossier-module">
          <div className="dossier-label">Deployment</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{engineer.location || 'Remote (Global)'}</div>
        </div>

        {isCompany && (
          <div className="dossier-module" style={{ background: 'var(--primary-container)', borderColor: 'var(--primary)' }}>
            <div className="dossier-label" style={{ color: 'var(--primary)' }}>Direct Action</div>
            <HireButtons username={engineer.username} />
          </div>
        )}

        {isSelf && (
          <Link href="/dashboard" className="btn-secondary" style={{ textAlign: 'center', padding: '1rem' }}>
            Update Dossier
          </Link>
        )}
      </aside>

      {/* MAIN CONTENT: MISSION DATA */}
      <main className="dossier-main">
        <header className="typewriter-fade">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>{engineer.full_name}</h1>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', marginTop: '0.5rem' }}>IDENTIFIER: @{engineer.username} // ACCESS_LEVEL: ALPHA</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {engineer.github_url && <a href={engineer.github_url} target="_blank" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>GITHUB //_</a>}
              {engineer.linkedin_url && <a href={engineer.linkedin_url} target="_blank" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>LINKEDIN //_</a>}
            </div>
          </div>

          <div className="dossier-module" style={{ marginTop: '2rem', borderLeft: '4px solid var(--primary)' }}>
            <div className="dossier-label">Strategic Narrative</div>
            <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
              {engineer.bio || 'Elite specialist contributing to advanced neural architectures and autonomous AI ecosystems.'}
            </p>
          </div>
        </header>

        <section className="typewriter-fade" style={{ animationDelay: '0.2s' }}>
          <div className="dossier-label">Capability Matrix</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[...(engineer.primary_languages || []), ...(engineer.frameworks || []), ...(engineer.domain_expertise || [])].map((skill: string) => (
              <span key={skill} className="stack-chip" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: '1px solid var(--dossier-border)', color: 'var(--primary)' }}>
                {skill.toUpperCase()}
              </span>
            ))}
          </div>
        </section>

        <section className="typewriter-fade" style={{ animationDelay: '0.4s' }}>
          <div className="dossier-label" style={{ marginBottom: '1.5rem' }}>Technical Case Studies // Evidence Logs</div>
          <div className="grid-2">
            {projects.map((p: any) => (
              <div key={p.title} className="dossier-module" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{p.title}</h3>
                  <div className="glass-badge" style={{ color: 'var(--secondary)' }}>LOGGED</div>
                </div>
                <div>
                  <div className="dossier-label" style={{ color: 'var(--primary-dim)', marginBottom: '0.25rem' }}>Objective</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', margin: 0 }}>{p.problem}</p>
                </div>
                <div>
                  <div className="dossier-label" style={{ color: 'var(--success)', marginBottom: '0.25rem' }}>Outcome</div>
                  <p style={{ fontSize: '0.85rem', color: '#fff', margin: 0 }}>{p.outcome}</p>
                </div>
                {p.demo_url && (
                  <a href={p.demo_url} target="_blank" className="btn-primary" style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
                    Access Live Stream ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
