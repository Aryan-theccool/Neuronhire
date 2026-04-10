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
      <section className="hero">
        <h1>{"India's Premier AI Talent & Marketplace"}</h1>
        <p>Build. Be Found. Get Paid. Build Again. The platform where elite AI engineers meet world-class companies.</p>
        <div className="hero__actions">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-primary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>
                {role === 'company' ? 'My Company Dashboard' : 'My Engineer Dashboard'}
              </Link>
              <Link href="/jobs" className="btn-secondary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>
                {role === 'company' ? 'Manage Opportunities' : 'Explore Opportunities'}
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup" className="btn-primary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Join as Engineer</Link>
              <Link href="/signup" className="btn-secondary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Hire AI Talent</Link>
            </>
          )}
        </div>
      </section>

      <div className="stat-bar">
        <div className="stat-card"><div className="stat-card__number">2,400+</div><div className="stat-card__label">AI Engineers</div></div>
        <div className="stat-card"><div className="stat-card__number">580+</div><div className="stat-card__label">Companies</div></div>
        <div className="stat-card"><div className="stat-card__number">{"₹"}4.2Cr</div><div className="stat-card__label">Bounties Paid</div></div>
        <div className="stat-card"><div className="stat-card__number">320+</div><div className="stat-card__label">AI Products</div></div>
      </div>

      <div className="page-container">
        <h2 className="section-title">Top Engineers</h2>
        <div className="grid-3" style={{marginBottom: '3rem'}}>
          {displayEngineers.length > 0 ? (
            displayEngineers.map((e: any) => <EngineerCard key={e.username} engineer={e} />)
          ) : (
            <p>No engineers found.</p>
          )}
        </div>

        <h2 className="section-title">Latest Opportunities</h2>
        <div className="grid-2" style={{marginBottom: '3rem'}}>
          {displayJobs.length > 0 ? (
            displayJobs.map((j: any) => <JobCard key={j.id} job={j} />)
          ) : (
            <p>No opportunities available.</p>
          )}
        </div>

        <h2 className="section-title">Active Bounties</h2>
        <div className="grid-2" style={{marginBottom: '3rem'}}>
          {displayBounties.length > 0 ? (
            displayBounties.map((b: any) => <BountyCard key={b.id} bounty={b} />)
          ) : (
            <p>No bounties available.</p>
          )}
        </div>

        <h2 className="section-title">AI Product Marketplace</h2>
        <div className="grid-3" style={{marginBottom: '3rem'}}>
          {displayProducts.length > 0 ? (
            displayProducts.map((p: any) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </>
  )
}
