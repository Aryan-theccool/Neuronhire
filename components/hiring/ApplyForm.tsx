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
      <div className="card" style={{padding: '2rem', textAlign: 'center', borderColor: 'var(--primary)'}}>
        <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Application Sent! 🚀</h3>
        <p style={{fontSize: '0.9rem', color: 'var(--on-surface-variant)'}}>
          The company has been notified. They will review your profile and NeuronScore.
        </p>
      </div>
    )
  }

  return (
    <div className="card" style={{padding: '1.5rem'}}>
      <h3 style={{marginBottom: '1rem'}}>Apply for this Role</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Cover Note</label>
          <textarea 
            name="coverNote"
            className="form-input" 
            placeholder="Why are you a good fit for this AI role?" 
            required 
            rows={4}
            style={{resize: 'none'}}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Proposed Rate (INR) - Optional</label>
          <input 
            type="number" 
            name="proposedRate"
            className="form-input" 
            placeholder="e.g. 5000" 
          />
        </div>
        
        {error && (
          <p style={{color: 'var(--error)', fontSize: '0.8rem', marginBottom: '1rem'}}>
            {error}
          </p>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          style={{width: '100%'}}
          disabled={loading}
        >
          {loading ? 'Sending Application...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
