'use client'

import { useState } from 'react'
import { applyToJob } from '@/app/actions/engagement'

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('jobId', jobId)

    try {
      const result = await applyToJob(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{padding: '1.5rem', textAlign: 'center', background: 'rgba(204, 151, 255, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary)'}}>
        <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🚀</div>
        <h3 style={{color: 'var(--primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)'}}>Transmission Successful</h3>
        <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5}}>
          The company has been notified of your interest. Your NeuronScore and technical profile are now under review.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      <div className="form-group">
        <label className="form-label">Cover Note</label>
        <textarea 
          name="coverNote"
          className="form-textarea" 
          placeholder="Briefly state your technical advantage for this role..." 
          required 
          rows={5}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Proposed Multiplier (INR/hr)</label>
        <input 
          type="number" 
          name="proposedRate"
          className="modern-input" 
          placeholder="e.g. 5000" 
        />
        <p style={{fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginTop: '0.5rem'}}>Suggested: Match or beat the company budget for priority review.</p>
      </div>
      
      {error && (
        <div style={{padding: '0.75rem', background: 'rgba(255, 110, 132, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.8rem'}}>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        style={{width: '100%', padding: '1rem', fontWeight: 700}}
        disabled={loading}
      >
        {loading ? 'Initiating Application...' : 'Commit Application'}
      </button>
    </form>
  )
}
