'use client'

import { useState } from 'react'
import { submitBounty } from '@/app/actions/engagement'

export default function BountySubmissionForm({ bountyId }: { bountyId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('bountyId', bountyId)

    try {
      const result = await submitBounty(formData)
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
        <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Solution Submitted! 🏆</h3>
        <p style={{fontSize: '0.9rem', color: 'var(--on-surface-variant)'}}>
          Great job! The company will review your work and contact you if you win.
        </p>
      </div>
    )
  }

  return (
    <div className="card" style={{padding: '1.5rem'}}>
      <h3 style={{marginBottom: '1rem'}}>Submit Your Solution</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Solution Description</label>
          <textarea 
            name="solutionDescription"
            className="form-input" 
            placeholder="Briefly describe your approach and results..." 
            required 
            rows={4}
            style={{resize: 'none'}}
          />
        </div>
        <div className="form-group">
          <label className="form-label">GitHub Repository URL</label>
          <input 
            type="url" 
            name="githubUrl"
            className="form-input" 
            placeholder="https://github.com/your-username/repo" 
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Demo URL (Optional)</label>
          <input 
            type="url" 
            name="demoUrl"
            className="form-input" 
            placeholder="https://your-demo.app" 
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
          {loading ? 'Submitting Solution...' : 'Submit Work'}
        </button>
      </form>
    </div>
  )
}
