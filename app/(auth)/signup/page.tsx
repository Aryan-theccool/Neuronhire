'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [role, setRole] = useState<'engineer' | 'company'>('engineer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Signup as ' + role + ': ' + email)
  }

  return (
    <div style={{maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Join NeuronHire</h1>
      <p style={{textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>Start your AI career or find top AI talent</p>

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button
          className={role === 'engineer' ? 'btn-primary' : 'btn-secondary'}
          style={{flex: 1}} onClick={() => setRole('engineer')}>
          {"I'm an Engineer"}
        </button>
        <button
          className={role === 'company' ? 'btn-primary' : 'btn-secondary'}
          style={{flex: 1}} onClick={() => setRole('company')}>
          {"I'm a Company"}
        </button>
      </div>

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} />
        </div>
        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>
          Create {role === 'engineer' ? 'Engineer' : 'Company'} Account
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
