'use client'

import { useState } from 'react'
import { createJobPosting, createBounty } from '../../app/dashboard/actions'

export function CompanyForms() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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

  async function handleBountySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await createBounty(formData)
    setLoading(false)
    if (res.error) setMessage('Error: ' + res.error)
    else {
      setMessage('Bounty posted successfully!')
      e.currentTarget.reset()
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      {message && <div style={{padding: '1rem', background: 'var(--primary)', color: '#000', borderRadius: '4px'}}>{message}</div>}
      
      <div className="stat-card">
        <h3>Post a New AI Job</h3>
        <form onSubmit={handleJobSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input name="title" placeholder="Job Title (e.g. Lead Generative AI Engineer)" required className="modern-input" />
          <textarea name="description" placeholder="Job Description..." rows={3} required className="modern-input" />
          <div style={{display: 'flex', gap: '1rem'}}>
            <select name="engagement_type" className="modern-input" style={{flex: 1}}>
              <option value="fulltime">Full-time</option>
              <option value="internship">Internship</option>
              <option value="hourly">Hourly Contract</option>
              <option value="project">Project-based</option>
            </select>
            <input name="skills_required" placeholder="Skills (comma separated)" className="modern-input" style={{flex: 1}} />
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <input type="number" name="budget_min_inr" placeholder="Min Budget (INR)" className="modern-input" style={{flex: 1}} />
            <input type="number" name="budget_max_inr" placeholder="Max Budget (INR)" className="modern-input" style={{flex: 1}} />
          </div>
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>

      <div className="stat-card">
        <h3>Launch an AI Bounty</h3>
        <form onSubmit={handleBountySubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input name="title" placeholder="Bounty Title (e.g. Fix Hallucinations in RAG)" required className="modern-input" />
          <textarea name="problem_description" placeholder="Describe the problem to solve..." rows={3} required className="modern-input" />
          <div style={{display: 'flex', gap: '1rem'}}>
            <input type="number" name="reward_inr" placeholder="Reward amount (INR)" required className="modern-input" style={{flex: 1}} />
            <input name="skills_needed" placeholder="Skills needed (comma separated)" className="modern-input" style={{flex: 1}} />
          </div>
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Launching...' : 'Launch Bounty'}
          </button>
        </form>
      </div>
    </div>
  )
}
