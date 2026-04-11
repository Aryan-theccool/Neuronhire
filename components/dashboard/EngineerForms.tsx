'use client'

import { useState } from 'react'
import { publishProduct } from '../../app/dashboard/actions'
import { PortfolioEditor } from './PortfolioEditor'
import { ProposalList } from './ProposalList'
import { ContractList } from './ContractList'
import { ReceivedOffers } from './ReceivedOffers'

interface EngineerFormsProps {
  profile: any
  projects: any[]
  proposals: any[]
  contracts: any[]
  invitations?: any[]
}

export function EngineerForms({ profile, projects, proposals, contracts }: EngineerFormsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'portfolio' | 'career' | 'offers' | 'marketplace'>('portfolio')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await publishProduct(formData)
    setLoading(false)
    if ('error' in res) setMessage('Error: ' + res.error)
    else {
      setMessage('Product published to Marketplace!')
      e.currentTarget.reset()
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      <div className="tabs" style={{display: 'flex', gap: '0.5rem'}}>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`tab-btn ${activeTab === 'portfolio' ? 'tab-btn--active' : ''}`}
        >
          My Portfolio
        </button>
        <button 
          onClick={() => setActiveTab('career')}
          className={`tab-btn ${activeTab === 'career' ? 'tab-btn--active' : ''}`}
        >
          Active Work
        </button>
        <button 
          onClick={() => setActiveTab('offers')}
          className={`tab-btn ${activeTab === 'offers' ? 'tab-btn--active' : ''}`}
        >
          Offers Received ✨
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`tab-btn ${activeTab === 'marketplace' ? 'tab-btn--active' : ''}`}
        >
          Monetize
        </button>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
        {message && <div style={{padding: '1rem', background: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '4px', marginBottom: '1rem'}}>{message}</div>}

        {activeTab === 'portfolio' && (
           <PortfolioEditor initialProfile={profile} projects={projects} />
        )}

        {activeTab === 'career' && (
           <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
             <ContractList contracts={contracts} role="engineer" />
             <ProposalList proposals={proposals} role="engineer" />
           </div>
        )}
        
        {activeTab === 'offers' && (
           <ReceivedOffers invitations={invitations || []} />
        )}
        
        {activeTab === 'marketplace' && (
          <div className="glass-card">
            <h2 style={{fontSize: '1.75rem', marginBottom: '1.5rem'}}>Monetize AI Assets</h2>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '2rem'}}>
              Sell your models, agents, and datasets directly to the NeuralHire community.
            </p>

            <form onSubmit={handleSubmit} className="form-section">
              <div className="form-section-title">Product Details</div>
              
              <div className="grid-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input name="name" placeholder="e.g. MedRAG Starter Kit" required className="modern-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select">
                    <option value="agent">AI Agent</option>
                    <option value="model">Fine-Tuned Model</option>
                    <option value="saas">SaaS Application</option>
                    <option value="workflow">Workflow/Pipeline</option>
                    <option value="dataset">Dataset</option>
                    <option value="template">Code Template</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" placeholder="Describe your product's capabilities..." rows={3} required className="form-textarea" />
              </div>
              
              <div className="grid-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Pricing Model</label>
                  <select name="pricing_model" className="form-select">
                    <option value="one_time">One-time Purchase</option>
                    <option value="monthly">Monthly Subscription</option>
                    <option value="free">Free / Open Source</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (INR)</label>
                  <input type="number" name="price_inr" placeholder="Enter amount" className="modern-input" />
                </div>
              </div>

              <div className="grid-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Demo URL</label>
                  <input name="demo_url" placeholder="https://..." className="modern-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tech Stack</label>
                  <input name="tech_stack" placeholder="Python, LlamaIndex, etc." className="modern-input" />
                </div>
              </div>
              
              <button type="submit" className="btn-primary" style={{width: '100%', padding: '1rem'}}>
                {loading ? 'Publishing...' : 'Publish to Marketplace'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

