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
  
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch (err) {
    console.error('Layout Auth Error:', err)
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-surface text-on-surface">
        <nav className="fixed top-0 w-full z-50 nav-glass">
          <div className="flex justify-between items-center px-6 md-px-12 h-16 w-full max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-12">
              <Link href="/" className="nav__logo no-underline">NeuralHire</Link>
              <div className="hidden md-flex gap-8">
                <Link href="/engineers" className="nav__link no-underline uppercase tracking-widest text-[11px]">Explore Engineers</Link>
                <Link href="/jobs" className="nav__link no-underline uppercase tracking-widest text-[11px]">Browse Tasks</Link>
                <Link href="/marketplace" className="nav__link no-underline uppercase tracking-widest text-[11px]">Marketplace</Link>
                <Link href="/knowledge" className="nav__link no-underline uppercase tracking-widest text-[11px]">Knowledge Hub</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="nav__link no-underline uppercase tracking-widest text-[11px] px-4 py-2 hover:bg-surface-container rounded-lg transition-all">Dashboard</Link>
                  <form action="/auth/signout" method="post" style={{margin: 0}}>
                    <button type="submit" className="btn-primary" style={{padding: '0.5rem 1.25rem', fontSize: '10px'}}>
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav__link no-underline uppercase tracking-widest text-[11px] px-4 py-2 hover:bg-surface-container rounded-lg transition-all">Sign In</Link>
                  <Link href="/signup" className="btn-primary no-underline" style={{padding: '0.5rem 1.25rem', fontSize: '10px'}}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="relative pt-16 min-h-screen">
          {children}
        </main>

        <footer className="w-full py-16 px-6 md:px-12 border-t border-outline-variant/10 bg-[#0d0e10]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col gap-2 scale-90 md:scale-100 origin-left">
                <span className="text-xl font-bold tracking-tighter text-[#e3e2e5]">NeuralHire</span>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c2c6d4] opacity-60">© 2024 NeuralHire AI. India's AI Premier Platform.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                <Link className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest opacity-80" href="/privacy">Privacy Policy</Link>
                <Link className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest opacity-80" href="/terms">Terms of Service</Link>
                <Link className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest opacity-80" href="/status">System Status</Link>
                <Link className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest opacity-80" href="/security">Security</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}