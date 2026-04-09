'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createJobPosting, createBounty } from '../../app/dashboard/actions'
import { ProposalList } from './ProposalList'
import { ContractList } from './ContractList'
import { formatCurrency } from '@/lib/utils'

interface CompanyFormsProps {
  profile: any
  proposals: any[]
  contracts: any[]
  jobs?: any[]
}

export function CompanyForms({ profile, proposals, contracts, jobs = [] }: CompanyFormsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'hiring' | 'work'>('hiring')
  const [successModal, setSuccessModal] = useState<{show: boolean, type: 'job' | 'bounty', id: string}>({
    show: false,
    type: 'job',
    id: ''
  })

  async function handleJobSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await createJobPosting(formData)
    setLoading(false)
    if ('error' in res) setMessage('Error: ' + res.error)
    else {
      setSuccessModal({ show: true, type: 'job', id: res.id || '' })
      e.currentTarget.reset()
    }
  }

  async function handleBountySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await createBounty(formData)
    setLoading(false)
    if ('error' in res) setMessage('Error: ' + res.error)
    else {
      setSuccessModal({ show: true, type: 'bounty', id: res.id || '' })
      e.currentTarget.reset()
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      {/* Success Modal */}
      {successModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '3rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
              border: '2px solid var(--success)', color: 'var(--success)', fontSize: '2.5rem'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              {successModal.type === 'job' ? 'AI Role Published' : 'Bounty Launched'}
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Your opportunity is now live on the platform. Top AI talent has been notified through our matching engine.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link 
                href={successModal.type === 'job' ? `/jobs/${successModal.id}` : `/bounties/${successModal.id}`}
                className="btn-primary"
                style={{ flex: 1, padding: '0.8rem' }}
              >
                View Listing
              </Link>
              <button 
                onClick={() => setSuccessModal({ ...successModal, show: false })}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.8rem' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

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

      {message && <div style={{padding: '1rem', background: 'var(--error-container)', color: 'var(--error)', borderRadius: '4px', border: '1px solid var(--error)'}}>{message}</div>}
      
      {activeTab === 'hiring' ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
          
          {/* NEW: DASHBOARD JOB LIST FOR TRANSPARENCY */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{fontSize: '1.75rem'}}>Your Published Roles</h2>
              <span style={{ fontSize: '0.8rem', background: 'var(--primary-container)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                {jobs.length} Active
              </span>
            </div>
            {jobs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map((job: any) => (
                  <div key={job.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{job.title}</h4>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
                        {job.engagement_type} • {job.status} • {job.budget_max_inr ? `${formatCurrency(job.budget_max_inr)} cap` : 'Flexible'}
                      </p>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--outline-variant)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>No active roles posted yet.</p>
              </div>
            )}
          </div>

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

          <div className="glass-card">
            <h2 style={{fontSize: '1.75rem', marginBottom: '1.5rem'}}>Launch a Bounty</h2>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '2rem'}}>
              Solved specific technical bottlenecks through community-driven innovation.
            </p>
            <form onSubmit={handleBountySubmit} className="form-section">
              <div className="form-group">
                <label className="form-label">Bounty Title</label>
                <input name="title" placeholder="e.g. Optimize Llama-3 Inference Pipeline" required className="modern-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Problem Description</label>
                <textarea name="problem_description" placeholder="Describe the technical bottleneck..." rows={4} required className="form-textarea" />
              </div>
              <div className="grid-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Reward (INR)</label>
                  <input type="number" name="reward_inr" placeholder="₹" required className="modern-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills Needed</label>
                  <input name="skills_needed" placeholder="CUDA, Python, ONNX..." className="modern-input" />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%', padding: '1rem'}}>
                {loading ? 'Launching...' : 'Launch Bounty'}
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
