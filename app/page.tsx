import Link from 'next/link'
import EngineerCard from '@/components/profile/EngineerCard'
import JobCard from '@/components/hiring/JobCard'
import BountyCard from '@/components/hiring/BountyCard'
import ProductCard from '@/components/marketplace/ProductCard'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: engineers },
    { data: jobs },
    { data: bounties },
    { data: products },
    { data: session }
  ] = await Promise.all([
    supabase.from('engineers').select('*').limit(3),
    supabase.from('job_postings').select('*, company:companies(company_name, logo_url)').limit(2).order('created_at', { ascending: false }),
    supabase.from('bounties').select('*, company:companies(company_name, logo_url)').limit(2).order('created_at', { ascending: false }),
    supabase.from('marketplace_products').select('*, engineer:engineers(full_name, avatar_url, username)').limit(3).order('created_at', { ascending: false }),
    supabase.auth.getUser()
  ]);

  const user = session?.user;
  const role = user?.user_metadata?.role || 'engineer';

  const displayEngineers = engineers || [];
  const displayJobs = jobs || [];
  const displayBounties = bounties || [];
  const displayProducts = products || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 hero-gradient">
        <div className="hero-bg-overlay">
          <img 
            className="hero-image" 
            alt="abstract neural network visualization" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbcI7KSEUcjsLzgZ7ZBCLfO9EqK7ycWW38kXrBLInA_cN3TF-GQ9dpjegU-qmD7RcGp5YdtCaSn9qWdHnHNmQnU3XA9IAtAmssP6zMSgNKB9C5jGwA1kXuf07irH-QOx-t0KdFcVLcWzCjj54yZB6tHL_Miqoy8QirTh3jpbzyDzh7xcxi_sukeHPbCONUnI0-eYK0cJ4wtaUXeaHo769kE7IopXtoM6Nksi2PdQwLTdWYtzf8cbzxq27qdHMOlE5qZCLJs3lSk1Q"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-surface-container-low border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#adc6ff]"></span>
            <span style={{fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)'}}>
              The Future of AI Engineering is here
            </span>
          </div>
          
          <h1 style={{fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, color: 'var(--on-surface)', marginBottom: '2rem'}}>
            Hire the world's best <span style={{color: 'var(--primary)'}}>AI engineers.</span>
          </h1>
          
          <p style={{maxWidth: '42rem', margin: '0 auto 3rem', fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--on-surface-variant)', fontWeight: 500, lineHeight: 1.6}}>
            A curated platform for B2B AI talent and products. No fluff, just results. Built for teams who need surgical precision in neural architecture.
          </p>

          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyCenter: 'center', gap: '1rem', flexWrap: 'wrap'}}>
            <Link href="/engineers" className="btn-primary" style={{padding: '1rem 2.5rem'}}>
              Find Talent
              <span className="material-symbols-outlined" style={{fontSize: '18px', marginLeft: '0.5rem'}}>arrow_forward</span>
            </Link>
            <Link href="/marketplace" className="btn-secondary" style={{padding: '1rem 2.5rem'}}>
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bento Section */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-24">
        <div className="grid-3" style={{gap: '1rem'}}>
          <div className="bento-card">
            <span style={{fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)'}}>Global Talent</span>
            <h3 style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--on-surface)'}}>5,000+</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>Vetted neural specialists across 40 countries.</p>
          </div>
          <div className="bento-card">
            <span style={{fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)'}}>Deployment Speed</span>
            <h3 style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--on-surface)'}}>48 Hours</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>Average time from initial contact to onboarding.</p>
          </div>
          <div className="bento-card">
            <span style={{fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)'}}>Quality Bar</span>
            <h3 style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--on-surface)'}}>Top 1%</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>Stringent technical assessment including LLM fine-tuning tasks.</p>
          </div>
        </div>
      </section>

      {/* Dynamic Results Section */}
      <div className="page-container" style={{paddingTop: 0}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem'}}>
          <div>
            <h2 className="section-title" style={{border: 'none', marginBottom: '0.5rem'}}>Top Vetted Engineers</h2>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '0.9rem'}}>Elite AI researchers and engineers ready to scale your infrastructure.</p>
          </div>
          <Link href="/engineers" className="nav__link" style={{color: 'var(--primary)', fontWeight: 600}}>View all engineers →</Link>
        </div>
        
        <div className="grid-3" style={{marginBottom: '6rem'}}>
          {displayEngineers.length > 0 ? (
            displayEngineers.map((e: any) => <EngineerCard key={e.username} engineer={e} />)
          ) : (
            <p>No engineers found.</p>
          )}
        </div>

        {/* High-Velocity Feature Section */}
        <section style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem'}}>
          <div>
            <h2 style={{fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem'}}>Built for High-Velocity <span style={{color: 'var(--primary)'}}>AI Teams.</span></h2>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6}}>
              Access a dedicated marketplace of pre-built AI components, fine-tuned models, and senior engineers capable of scaling your infrastructure from prototype to production.
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
              <div style={{display: 'flex', gap: '1.25rem'}}>
                <div style={{width: '40px', height: '40px', background: 'var(--surface-container-high)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0}}>
                  <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>verified_user</span>
                </div>
                <div>
                  <h4 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: '0.25rem'}}>Proof of Capability</h4>
                  <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>Every profile is backed by verified code contributions and production case studies.</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: '1.25rem'}}>
                <div style={{width: '40px', height: '40px', background: 'var(--surface-container-high)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0}}>
                  <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>database</span>
                </div>
                <div>
                  <h4 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: '0.25rem'}}>Compute Ready</h4>
                  <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>Direct access to H100 clusters and optimized cloud infrastructure providers.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface-container-highest shadow-2xl">
            <img 
              className="w-full h-full object-cover" 
              alt="futuristic control room interface" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMK0n665tGHkK15MTuoClxo2bE2gnbwsGm5gVqFKaiVc753vTWXoO0GIKBqk6kb5FOm80_JoaJy_kHLorul_4xxrs3dr0wo8-2OsI0JIWgvVajCScMbkcMI-mydZbgnuveHZSK5tmdPisi767SqEiWotzEW0wg_v_IVyTJZqeXcqd5Tg3JyavZyVCnKdkreiLeFb5gIib21nDWWzkKb6nmZ2n_wXjkcaj6YKNnao_WJPKpsf464iUUdUjCDROuS57guctubIj5fOI" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-40"></div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{textAlign: 'center', marginBottom: '8rem'}}>
          <div className="bg-surface-container-low" style={{padding: '5rem 2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.03)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, right: 0, width: '16rem', height: '16rem', background: 'rgba(173, 198, 255, 0.05)', filter: 'blur(100px)', borderRadius: '50%'}}></div>
            <h2 style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem'}}>Scale your AI capacity today.</h2>
            <p style={{color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: '30rem', margin: '0 auto 2.5rem'}}>
              Join the world's most innovative companies leveraging NeuralHire to bridge the AI talent gap.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyCenter: 'center', flexWrap: 'wrap'}}>
              <Link href="/contact" className="btn-primary" style={{padding: '1rem 3rem'}}>Contact Sales</Link>
              <Link href="/engineers" className="btn-secondary" style={{padding: '1rem 3rem'}}>Explore Talent</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
