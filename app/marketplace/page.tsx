import ProductCard from '@/components/marketplace/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { SAMPLE_PRODUCTS } from '@/lib/samples'

export const revalidate = 0;

export default async function MarketplacePage() {
  const supabase = await createClient()

  // Joining with engineers to get publisher info
  const { data: dbProducts, error } = await supabase
    .from('marketplace_products')
    .select('*, engineer:engineers(full_name, avatar_url, username)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Marketplace Fetch Error:', error.message, error.details)
  }

  // Hybrid Feed: Mix real products with premium samples
  const displayProducts = [
    ...(dbProducts || []),
    ...SAMPLE_PRODUCTS
  ].slice(0, 9);

  return (
    <div className="page-container" style={{ paddingTop: '3rem' }}>
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>AI Marketplace</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', maxWidth: '800px' }}>
          Explore and acquire elite AI agents, custom models, and specialized datasets built by the Indian AI vanguard.
        </p>
      </div>

      <div className="sidebar-layout">
        <aside className="filters">
          <div className="filter-group">
            <h3>Resource Category</h3>
            {['Agent','Model','SaaS','Workflow','Dataset','Template'].map(c => (
              <label key={c} className="filter-option">
                <input type="checkbox" defaultChecked /> <span>{c}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Monetization</h3>
            {['Free','One-time','Subscription','Usage-based'].map(p => (
              <label key={p} className="filter-option">
                <input type="checkbox" defaultChecked /> <span>{p}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Minimum Rating</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input type="range" min="0" max="5" step="0.5" defaultValue="4"
                style={{ width:'100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>4.0+</span>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(204, 151, 255, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(204, 151, 255, 0.1)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Want to Publish?</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              Turn your AI models into recurring revenue. List them in minutes.
            </p>
          </div>
        </aside>

        <div className="grid-3">
          {displayProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
