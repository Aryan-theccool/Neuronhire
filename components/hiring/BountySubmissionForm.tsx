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
      <div style={{padding: '1.5rem', textAlign: 'center', background: 'rgba(255, 215, 0, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--secondary)'}}>
        <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🏆</div>
        <h3 style={{color: 'var(--secondary)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)'}}>Solution Recorded</h3>
        <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5}}>
          Your technical solution has been entered into the audit pipeline. You will be notified once the review is complete.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      <div className="form-group">
        <label className="form-label">Technical Approach</label>
        <textarea 
          name="solutionDescription"
          className="form-textarea" 
          placeholder="Explicate your methodology and performance results..." 
          required 
          rows={5}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Repository Artifact (GitHub URL)</label>
        <input 
          type="url" 
          name="githubUrl"
          className="modern-input" 
          placeholder="https://github.com/..." 
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Validation Link (Demo URL - Optional)</label>
        <input 
          type="url" 
          name="demoUrl"
          className="modern-input" 
          placeholder="https://..." 
        />
      </div>
      
      {error && (
        <div style={{padding: '0.75rem', background: 'rgba(255, 110, 132, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.8rem'}}>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        style={{width: '100%', padding: '1rem', fontWeight: 700, background: 'var(--secondary)', color: '#000', borderColor: 'var(--secondary)'}}
        disabled={loading}
      >
        {loading ? 'Committing Solution...' : 'Publish Solution Artifact'}
      </button>
    </form>
  )
}
