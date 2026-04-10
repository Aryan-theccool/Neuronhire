'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions'
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
  const [role, setRole] = useState<'engineer' | 'company'>('engineer')
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div style={{maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Join NeuralHire</h1>
      <p style={{textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>Start your AI career or find top AI talent</p>

      {message && (
        <p className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>
          {message}
        </p>
      )}

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button
          type="button"
          className={role === 'engineer' ? 'btn-primary' : 'btn-secondary'}
          style={{flex: 1}} onClick={() => setRole('engineer')}>
          {"I'm an Engineer"}
        </button>
        <button
          type="button"
          className={role === 'company' ? 'btn-primary' : 'btn-secondary'}
          style={{flex: 1}} onClick={() => setRole('company')}>
          {"I'm a Company"}
        </button>
      </div>

      <form action={signup}>
        <input type="hidden" name="role" value={role} />
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="email" placeholder="you@example.com" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" placeholder="Min 8 characters" required minLength={8} />
        </div>

        {role === 'engineer' && (
          <div style={{marginTop: '2rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem'}}>
            <h3 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Talent Details</h3>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" name="full_name" placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" name="phone" placeholder="+91 98765 43210" />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" type="text" name="location" placeholder="Bangalore, India" required />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Role</label>
              <select name="primary_role" className="form-input" required style={{appearance: 'none'}}>
                <option value="">Select Role</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select name="experience_level" className="form-input" required style={{appearance: 'none'}}>
                <option value="">Select Level</option>
                <option value="Fresher">Fresher (0 years)</option>
                <option value="1-3 years">Junior (1–3 years)</option>
                <option value="3-5 years">Intermediate (3–5 years)</option>
                <option value="5+ years">Senior (5+ years)</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
          {role === 'engineer' ? 'Create Talent Profile' : 'Create Company Account'}
        </button>
      </form>
      
      <div style={{textAlign: 'center', margin: '1.5rem 0', color: 'var(--outline)'}}>or</div>
      <button className="btn-secondary" style={{width: '100%', marginBottom: '0.75rem'}}>Continue with GitHub</button>
      <button className="btn-secondary" style={{width: '100%'}}>Continue with Google</button>
      <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
        Already have an account? <Link href="/login">Sign In</Link>
      </p>
    </div>
  )
}

