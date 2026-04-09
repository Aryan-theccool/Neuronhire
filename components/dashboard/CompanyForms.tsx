'use client'

import { useState } from 'react'
import { createJobPosting, createBounty } from '../../app/dashboard/actions'
import { ProposalList } from './ProposalList'
import { ContractList } from './ContractList'

interface CompanyFormsProps {
  profile: any
  proposals: any[]
  contracts: any[]
}

export function CompanyForms({ profile, proposals, contracts }: CompanyFormsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'hiring' | 'work'>('hiring')

  async function handleJobSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await createJobPosting(formData)
    setLoading(false)
    if (res.error) setMessage('Error: ' + res.error)
    else {
      setMessage('Job posted successfully!')
      e.currentTarget.reset()
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      <div className="tabs" style={{display: 'flex', gap: '0.5rem'}}>
        <button 
          onClick={() => setActiveTab('hiring')}
          className={`tab-btn ${activeTab === 'hiring' ? 'tab-btn--active' : ''}`}
        >
          Hiring & Bounties
        </button>
        <button 
          onClick={() => setActiveTab('work')}
          className={`tab-btn ${activeTab === 'work' ? 'tab-btn--active' : ''}`}
        >
          Active Contracts ({contracts.length})
        </button>
      </div>

      {message && <div style={{padding: '1rem', background: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '4px'}}>{message}</div>}
      
      {activeTab === 'hiring' ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
          <ProposalList proposals={proposals} role="company" />
          
          <div className="glass-card">
            <h2 style={{fontSize: '1.75rem', marginBottom: '1.5rem'}}>Post a New AI Role</h2>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '2rem'}}>
              Recruit specialized AI talent for your next breakthrough project.
            </p>

            <form onSubmit={handleJobSubmit} className="form-section">
              <div className="form-section-title">Job Details</div>
              
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input name="title" placeholder="e.g. Lead Generative AI Engineer" required className="modern-input" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" placeholder="What will this person build?" rows={3} required className="form-textarea" />
              </div>
              
              <div className="grid-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Engagement Type</label>
                  <select name="engagement_type" className="form-select">
                    <option value="fulltime">Full-time</option>
                    <option value="internship">Internship</option>
                    <option value="hourly">Hourly Contract</option>
                    <option value="project">Project-based</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Skills Required</label>
                  <input name="skills_required" placeholder="Python, OpenAI, PyTorch..." className="modern-input" />
                </div>
              </div>
              
              <div className="grid-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Min Budget (INR)</label>
                  <input type="number" name="budget_min_inr" placeholder="0" className="modern-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Budget (INR)</label>
                  <input type="number" name="budget_max_inr" placeholder="Max" className="modern-input" />
                </div>
              </div>
              
              <button type="submit" className="btn-primary" style={{width: '100%', padding: '1rem'}}>
                {loading ? 'Posting...' : 'Post Job Opening'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <ContractList contracts={contracts} role="company" />
      )}
    </div>
  )
}
