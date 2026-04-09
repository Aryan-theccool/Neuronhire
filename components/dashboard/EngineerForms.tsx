'use client'

import { useState } from 'react'
import { publishProduct } from '../../app/dashboard/actions'
import { PortfolioEditor } from './PortfolioEditor'

interface EngineerFormsProps {
  profile: any
  projects: any[]
}

export function EngineerForms({ profile, projects }: EngineerFormsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
    <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
      {/* Portfolio Editor (NEW) */}
      <PortfolioEditor initialProfile={profile} projects={projects} />
      
      {/* Marketplace Product Form */}
      <div className="stat-card" style={{borderTop: '1px solid var(--outline-variant)', paddingTop: '3rem'}}>
        <h3>Publish AI Product to Marketplace</h3>
        <p style={{color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
          Sell your pre-trained models, agent workflows, datasets, or SaaS tools directly to buyers.
        </p>

        {message && <div style={{padding: '1rem', background: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '4px', marginBottom: '1rem'}}>{message}</div>}

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
    </div>
  )
}
