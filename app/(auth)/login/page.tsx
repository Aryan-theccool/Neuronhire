'use client'
import Link from 'next/link'
import { login } from '../actions'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div style={{maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Welcome Back</h1>
      <p style={{textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>Sign in to your NeuralHire account</p>
      
      {message && (
        <p className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>
          {message}
        </p>
      )}

      <form action={login}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="email" placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" placeholder="••••••••" required />
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

