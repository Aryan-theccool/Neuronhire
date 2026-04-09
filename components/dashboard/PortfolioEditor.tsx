'use client'

import { useState } from 'react'
import { updateEngineerProfile, addProject, deleteProject } from '@/app/dashboard/portfolio-actions'

interface PortfolioEditorProps {
  initialProfile: any
  projects: any[]
}

export function PortfolioEditor({ initialProfile, projects }: PortfolioEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'projects'>('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await updateEngineerProfile(formData)
    setLoading(false)
    if (res.error) setMessage('Error: ' + res.error)
    else setMessage('Profile updated successfully!')
  }

  async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await addProject(formData)
    setLoading(false)
    if (res.error) setMessage('Error: ' + res.error)
    else {
      setMessage('New project case study added!')
      e.currentTarget.reset()
    }
  }

  return (
    <div className="glass-card" style={{padding: '2.5rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
        <h2 style={{fontSize: '1.75rem', fontFamily: 'var(--font-display)'}}>Professional Portfolio</h2>
        <div style={{display: 'flex', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '0.25rem', border: '1px solid rgba(204, 151, 255, 0.1)'}}>
          <button 
            className={`tab-btn ${activeSubTab === 'profile' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveSubTab('profile')}
            style={{fontSize: '0.8rem', padding: '0.5rem 1rem'}}
          >
            Identity
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'projects' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveSubTab('projects')}
            style={{fontSize: '0.8rem', padding: '0.5rem 1rem'}}
          >
            Case Studies
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '1rem', 
          background: message.startsWith('Error') ? 'rgba(255, 110, 132, 0.1)' : 'rgba(204, 151, 255, 0.1)', 
          color: message.startsWith('Error') ? 'var(--error)' : 'var(--primary)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          border: '1px solid currentColor',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {activeSubTab === 'profile' ? (
        <form onSubmit={handleProfileUpdate} className="form-section">
          <div className="form-section-title">Professional Identity</div>
          
          <div className="grid-2" style={{gap: '2rem'}}>
            <div className="form-group">
              <label className="form-label">Professional Bio</label>
              <textarea 
                name="bio" 
                defaultValue={initialProfile?.bio || ''} 
                className="form-textarea"
                placeholder="Briefly describe your expertise..." 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">AI Philosophy</label>
              <textarea 
                name="ai_philosophy" 
                defaultValue={initialProfile?.ai_philosophy || ''} 
                className="form-textarea"
                placeholder="e.g. Build for impact, not just for metrics." 
              />
            </div>
          </div>

          <div className="grid-2" style={{gap: '2rem'}}>
            <div className="form-group">
              <label className="form-label">Hourly Rate (INR)</label>
              <input 
                type="number" 
                name="hourly_rate" 
                defaultValue={initialProfile?.hourly_rate_inr || ''} 
                className="modern-input" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">AI Stack (Comma Separated)</label>
              <input 
                name="ai_stack" 
                defaultValue={initialProfile?.ai_stack?.join(', ') || ''} 
                className="modern-input"
                placeholder="LangChain, PyTorch, Weaviate..." 
              />
            </div>
          </div>

          <div style={{marginTop: '1rem'}}>
            <div className="form-section-title">Social & Web Presence</div>
            <div className="grid-3" style={{gap: '1.5rem'}}>
              <div className="form-group">
                <label className="form-label">GitHub</label>
                <input name="github_url" defaultValue={initialProfile?.github_url || ''} className="modern-input" />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input name="linkedin_url" defaultValue={initialProfile?.linkedin_url || ''} className="modern-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input name="website_url" defaultValue={initialProfile?.website_url || ''} className="modern-input" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{width: '100%', marginTop: '1rem', padding: '1rem'}}>
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
           <div className="form-section">
              <div className="form-section-title">Current Portfolio ({projects.length})</div>
              <div className="grid-2" style={{gap: '1.25rem'}}>
                {projects.map(p => (
                  <div key={p.id} style={{
                    padding: '1.25rem',
                    background: 'var(--surface-container)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--outline-variant)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--on-surface)'}}>{p.title}</h4>
                      <p style={{fontSize: '0.8rem', color: 'var(--on-surface-variant)'}}>
                        {p.tech_stack?.join(', ')}
                      </p>
                    </div>
                    <button 
                      onClick={async () => {
                        if(confirm('Delete this case study?')) {
                          await deleteProject(p.id)
                        }
                      }}
                      className="btn-secondary"
                      style={{padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--error)'}}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--on-surface-variant)', border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)'}}>
                    No case studies added yet.
                  </div>
                )}
              </div>
           </div>

           <div className="form-section">
              <div className="form-section-title">Add New Case Study</div>
              <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>
                Detailing your technical approach builds trust and increases your NeuronScore.
              </p>
              
              <form onSubmit={handleAddProject} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Project Title</label>
                  <input name="title" required className="modern-input" placeholder="e.g. Real-time RAG Agent for FinTech" />
                </div>
                
                <div className="grid-2" style={{gap: '1.5rem'}}>
                  <div className="form-group">
                    <label className="form-label">The Problem</label>
                    <textarea name="problem" className="form-textarea" placeholder="What challenge were you solving?" rows={3} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">The Outcome</label>
                    <textarea name="outcome" className="form-textarea" placeholder="What was the measurable result?" rows={3} required />
                  </div>
                </div>

                <div className="grid-2" style={{gap: '1.5rem'}}>
                  <div className="form-group">
                    <label className="form-label">Tech Stack</label>
                    <input name="tech_stack" className="modern-input" placeholder="OpenAI, Pinecone, Next.js" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub URL (Optional)</label>
                    <input name="github_url" className="modern-input" placeholder="https://github.com/..." />
                  </div>
                </div>
                
                <button type="submit" className="btn-primary" disabled={loading} style={{width: '100%', padding: '1rem'}}>
                  {loading ? 'Adding...' : 'Publish Case Study'}
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
