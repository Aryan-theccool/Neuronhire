import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'NeuralHire — India\'s AI Talent & Marketplace Platform',
  description: 'Build. Be Found. Get Paid. Build Again.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav__logo">NeuralHire</Link>
          <div className="nav__links">
            <Link href="/engineers" className="nav__link">Explore Engineers</Link>
            <Link href="/jobs" className="nav__link">Browse Tasks</Link>
            <Link href="/marketplace" className="nav__link">Marketplace</Link>
            <Link href="/knowledge" className="nav__link">Knowledge Hub</Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="nav__link">Dashboard</Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>Sign Out</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="nav__link">Login</Link>
                <Link href="/signup" className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}