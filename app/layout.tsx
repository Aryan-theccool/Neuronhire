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
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-surface text-on-surface">
        <nav className="fixed top-0 w-full z-50 bg-[#1b1c1e] bg-opacity-30 backdrop-blur-md border-b border-outline-variant/10">
          <div className="flex justify-between items-center px-6 md:px-12 h-16 w-full max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-12">
              <Link href="/" className="text-xl font-bold tracking-tighter text-[#e3e2e5] no-underline">NeuralHire</Link>
              <div className="hidden md:flex gap-8">
                <Link href="/engineers" className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest no-underline">Explore Engineers</Link>
                <Link href="/jobs" className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest no-underline">Browse Tasks</Link>
                <Link href="/marketplace" className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest no-underline">Marketplace</Link>
                <Link href="/knowledge" className="text-[#c2c6d4] hover:text-[#e3e2e5] transition-colors font-['Inter'] text-[11px] font-semibold uppercase tracking-widest no-underline">Knowledge Hub</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-[#adc6ff] font-['Inter'] text-[11px] font-semibold uppercase tracking-widest hover:bg-[#292a2c] px-4 py-2 rounded-lg transition-all no-underline">Dashboard</Link>
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="bg-gradient-to-b from-primary to-primary-container text-[#001a42] px-5 py-2 rounded-lg font-['Inter'] text-[11px] font-semibold uppercase tracking-widest scale-95 active:scale-90 transition-transform">Sign Out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[#adc6ff] font-['Inter'] text-[11px] font-semibold uppercase tracking-widest hover:bg-[#292a2c] px-4 py-2 rounded-lg transition-all no-underline">Sign In</Link>
                  <Link href="/signup" className="bg-gradient-to-b from-primary to-primary-container text-[#001a42] px-5 py-2 rounded-lg font-['Inter'] text-[11px] font-semibold uppercase tracking-widest scale-95 active:scale-90 transition-transform no-underline">Get Started</Link>
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

        <style jsx>{`
          .fixed { position: fixed; }
          .top-0 { top: 0; }
          .w-full { width: 100%; }
          .z-50 { z-index: 50; }
          .bg-opacity-30 { --tw-bg-opacity: 0.3; }
          .backdrop-blur-md { backdrop-filter: blur(12px); }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .h-16 { height: 4rem; }
          .max-w-screen-2xl { max-width: 1536px; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .gap-12 { gap: 3rem; }
          .gap-8 { gap: 2rem; }
          .hidden { display: none; }
          @media (min-width: 768px) {
            .md\\:flex { display: flex; }
            .md\\:px-12 { padding-left: 3rem; padding-right: 3rem; }
          }
          .tracking-tighter { letter-spacing: -0.05em; }
          .text-xl { font-size: 1.25rem; }
          .font-bold { font-weight: 700; }
          .no-underline { text-decoration: none; }
          .bg-gradient-to-b { background: linear-gradient(to bottom, var(--primary), var(--primary-container)); }
          .rounded-lg { border-radius: 0.5rem; }
          .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
          .scale-95 { transform: scale(0.95); }
          .active\\:scale-90:active { transform: scale(0.9); }
          .origin-left { transform-origin: left; }
        `}</style>
      </body>
    </html>
  )
}