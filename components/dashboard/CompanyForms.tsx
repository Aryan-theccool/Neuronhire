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
      <div className="tabs" style={{display: 'flex', gap: '1rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem'}}>
        <button 
          onClick={() => setActiveTab('hiring')}
          className={activeTab === 'hiring' ? 'nav__link active' : 'nav__link'}
          style={{fontWeight: activeTab === 'hiring' ? 700 : 400}}
        >
          Hiring & Bounties
        </button>
        <button 
          onClick={() => setActiveTab('work')}
          className={activeTab === 'work' ? 'nav__link active' : 'nav__link'}
          style={{fontWeight: activeTab === 'work' ? 700 : 400}}
        >
          Manage Work ({contracts.length})
        </button>
      </div>

      {message && <div style={{padding: '1rem', background: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '4px'}}>{message}</div>}
      
      {activeTab === 'hiring' ? (
        <>
          <ProposalList proposals={proposals} role="company" />
          
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
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </form>
          </div>
        </>
      ) : (
        <ContractList contracts={contracts} role="company" />
      )}
    </div>
  )
}
