'use client'

import { useState } from 'react'
import { updateEngineerProfile, addProject, deleteProject } from '@/app/dashboard/portfolio-actions'

interface PortfolioEditorProps {
  initialProfile: any
  projects: any[]
}

export function PortfolioEditor({ initialProfile, projects }: PortfolioEditorProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile')
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
    <div className="portfolio-editor">
      <div className="tabs" style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button 
          onClick={() => setActiveTab('profile')}
          className={activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}
          style={{padding: '0.5rem 1.5rem'}}
        >
          Profile Details
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          className={activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}
          style={{padding: '0.5rem 1.5rem'}}
        >
          Project Case Studies
        </button>
      </div>

      {message && (
        <div style={{
          padding: '1rem', 
          background: message.startsWith('Error') ? 'var(--error-container)' : 'var(--primary-container)', 
          color: message.startsWith('Error') ? 'var(--error)' : 'var(--primary)', 
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid currentColor'
        }}>
          {message}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="stat-card">
          <h3 style={{marginBottom: '1.5rem'}}>Base Performance Profile</h3>
          <form onSubmit={handleProfileUpdate} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Professional Bio</label>
              <textarea 
                name="bio" 
                defaultValue={initialProfile?.bio || ''} 
                className="modern-input" 
                placeholder="Briefly describe your expertise..."
                rows={3}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">AI Philosophy</label>
                <input 
                  name="ai_philosophy" 
                  defaultValue={initialProfile?.ai_philosophy || ''} 
                  className="modern-input" 
                  placeholder="e.g. Build for impact, not just hype"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hourly Rate (INR)</label>
                <input 
                  type="number" 
                  name="hourly_rate_inr" 
                  defaultValue={initialProfile?.hourly_rate_inr || ''} 
                  className="modern-input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Specialized AI Stack (Comma separated)</label>
              <input 
                name="ai_stack" 
                defaultValue={initialProfile?.ai_stack?.join(', ') || ''} 
                className="modern-input" 
                placeholder="LangChain, PyTorch, Weaviate, etc."
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input name="github_url" defaultValue={initialProfile?.github_url || ''} className="modern-input" />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input name="linkedin_url" defaultValue={initialProfile?.linkedin_url || ''} className="modern-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input name="website_url" defaultValue={initialProfile?.website_url || ''} className="modern-input" />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'projects' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <div className="stat-card">
            <h3 style={{marginBottom: '1.5rem'}}>Add New Case Study</h3>
            <form onSubmit={handleAddProject} style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
              <input name="title" placeholder="Project Title (e.g. Customer Support Agent)" required className="modern-input" />
              
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Problem Definition</label>
                  <textarea name="problem" placeholder="What challenge were you solving?" rows={3} required className="modern-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Proposed Approach</label>
                  <textarea name="approach" placeholder="How did you use AI to solve it?" rows={3} required className="modern-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Measured Outcome</label>
                <textarea name="outcome" placeholder="What were the real-world results? (e.g. 40% faster latency)" rows={2} required className="modern-input" />
              </div>

              <div className="grid-2">
                <input name="tech_stack" placeholder="Tech Stack (LangChain, OpenAI, etc.)" required className="modern-input" />
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <input name="demo_url" placeholder="Demo Link" className="modern-input" style={{flex: 1}} />
                  <input name="github_url" placeholder="Code Repo" className="modern-input" style={{flex: 1}} />
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input type="checkbox" name="is_featured" value="true" id="featured" />
                <label htmlFor="featured">Feature this project on top</label>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding Project...' : 'Add Case Study to Portfolio'}
              </button>
            </form>
          </div>

          <div className="stat-card">
            <h3 style={{marginBottom: '1rem'}}>Current Portfolio ({projects.length})</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {projects.map(p => (
                <div key={p.id} style={{
                  padding: '1rem', 
                  border: '1px solid var(--outline-variant)', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{marginBottom: '0.25rem'}}>{p.title}</h4>
                    <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
                      {p.tech_stack?.join(', ')}
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      if(confirm('Delete this case study?')) {
                        await deleteProject(p.id)
                      }
                    }}
                    style={{color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem'}}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {projects.length === 0 && <p style={{textAlign: 'center', color: 'var(--on-surface-variant)'}}>No case studies added yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
