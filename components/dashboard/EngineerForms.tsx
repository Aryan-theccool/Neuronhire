'use client'

import { useState } from 'react'
import { publishProduct } from '../../app/dashboard/actions'
import { PortfolioEditor } from './PortfolioEditor'
import { ProposalList } from './ProposalList'
import { ContractList } from './ContractList'

interface EngineerFormsProps {
  profile: any
  projects: any[]
  proposals: any[]
  contracts: any[]
}

export function EngineerForms({ profile, projects, proposals, contracts }: EngineerFormsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'portfolio' | 'career' | 'marketplace'>('portfolio')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await publishProduct(formData)
    setLoading(false)
    if (res.error) setMessage('Error: ' + res.error)
    else {
      setMessage('Product published to Marketplace!')
      e.currentTarget.reset()
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      <div className="tabs" style={{display: 'flex', gap: '1rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem'}}>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={activeTab === 'portfolio' ? 'nav__link active' : 'nav__link'}
          style={{fontWeight: activeTab === 'portfolio' ? 700 : 400}}
        >
          My Portfolio
        </button>
        <button 
          onClick={() => setActiveTab('career')}
          className={activeTab === 'career' ? 'nav__link active' : 'nav__link'}
          style={{fontWeight: activeTab === 'career' ? 700 : 400}}
        >
          Active Work & Applications
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={activeTab === 'marketplace' ? 'nav__link active' : 'nav__link'}
          style={{fontWeight: activeTab === 'marketplace' ? 700 : 400}}
        >
          Monetize AI
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
        
        {activeTab === 'marketplace' && (
          <div className="stat-card" style={{borderTop: '1px solid var(--outline-variant)', paddingTop: '1rem'}}>
            <h3>Publish AI Product to Marketplace</h3>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
              Sell your pre-trained models, agent workflows, datasets, or SaaS tools directly to buyers.
            </p>

            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input name="name" placeholder="Product Name (e.g. MedRAG Starter Kit)" required className="modern-input" style={{flex: 2}} />
                <select name="category" className="modern-input" style={{flex: 1}}>
                  <option value="agent">AI Agent</option>
                  <option value="model">Fine-Tuned Model</option>
                  <option value="saas">SaaS Application</option>
                  <option value="workflow">Workflow/Pipeline</option>
                  <option value="dataset">Dataset</option>
                  <option value="template">Code Template</option>
                </select>
              </div>
              
              <textarea name="description" placeholder="Describe your product's capabilities..." rows={3} required className="modern-input" />
              
              <div style={{display: 'flex', gap: '1rem'}}>
                <select name="pricing_model" className="modern-input" style={{flex: 1}}>
                  <option value="one_time">One-time Purchase</option>
                  <option value="monthly">Monthly Subscription</option>
                  <option value="free">Free / Open Source</option>
                </select>
                <input type="number" name="price_inr" placeholder="Price (INR)" className="modern-input" style={{flex: 1}} />
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <input name="demo_url" placeholder="Demo URL (Optional)" className="modern-input" style={{flex: 1}} />
                <input name="tech_stack" placeholder="Tech Stack (comma separated)" className="modern-input" style={{flex: 1}} />
              </div>
              
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Product'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
