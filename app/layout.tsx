import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'NeuronHire — India\'s AI Talent & Marketplace Platform',
  description: 'Build. Be Found. Get Paid. Build Again.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav__logo">NeuronHire</Link>
          <div className="nav__links">
            <Link href="/jobs" className="nav__link">Jobs</Link>
            <Link href="/bounties" className="nav__link">Bounties</Link>
            <Link href="/marketplace" className="nav__link">Marketplace</Link>
            <Link href="/login" className="nav__link">Login</Link>
            <Link href="/signup" className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>Sign Up</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}