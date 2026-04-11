'use client'
import Link from 'next/link'
import { login } from '../actions'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ maxWidth: 460, width: '100%', padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 800 }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Sign in to your NeuralHire mission control</p>
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255, 180, 171, 0.1)', 
            border: '1px solid rgba(255, 180, 171, 0.2)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            color: 'var(--error)',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Authorization Code</label>
            <input className="form-input" type="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
            Initiate Access
          </button>
        </form>
        
        <div style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--outline)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Alternative Protocols
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>Continue with GitHub</button>
          <button className="btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>Continue with Google</button>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
          {"New to the platform? "}<Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an ID</Link>
        </p>
      </div>
    </div>
  )
}

