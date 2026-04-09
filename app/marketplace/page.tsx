import ProductCard from '@/components/marketplace/ProductCard'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0;

export default async function MarketplacePage() {
  const supabase = await createClient()

  const { data: dbProducts, error } = await supabase
    .from('marketplace_products')
    .select('*, engineer:engineers(full_name, avatar_url, username)')
    .order('created_at', { ascending: false })

  const displayProducts = dbProducts || [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Product Marketplace</h1>
        <p>Discover, try, and buy AI agents, models, datasets, and tools built by top Indian AI engineers.</p>
      </div>
      <div className="sidebar-layout">
        <aside className="filters">
          <div className="filter-group">
            <h3>Category</h3>
            {['Agent','Model','SaaS','Workflow','Dataset','Template'].map(c => (
              <label key={c} className="filter-option">
                <input type="checkbox" defaultChecked /> {c}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Pricing</h3>
            {['Free','One-time','Monthly','Usage-based'].map(p => (
              <label key={p} className="filter-option">
                <input type="checkbox" defaultChecked /> {p}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Min Rating</h3>
            <input type="range" min="0" max="5" step="0.5" defaultValue="0"
              style={{width:'100%', accentColor: 'var(--primary)'}} />
          </div>
        </aside>
        <div className="grid-3">
          {displayProducts.length > 0 ? (
            displayProducts.map((p: any) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)'}}>
              <p style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🛒</p>
              <p style={{fontWeight: 600}}>No products listed yet.</p>
              <p style={{marginTop: '0.5rem'}}>Publish your first AI product from your Engineer Dashboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
