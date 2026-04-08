'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Login with: ' + email)
  }

  return (
    <div style={{maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Welcome Back</h1>
      <p style={{textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>Sign in to your NeuronHire account</p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>Sign In</button>
      </form>
      <div style={{textAlign: 'center', margin: '1.5rem 0', color: 'var(--outline)'}}>or</div>
      <button className="btn-secondary" style={{width: '100%', marginBottom: '0.75rem'}}>Continue with GitHub</button>
      <button className="btn-secondary" style={{width: '100%'}}>Continue with Google</button>
      <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
        {"Don't have an account? "}<Link href="/signup">Sign Up</Link>
      </p>
    </div>
  )
}
