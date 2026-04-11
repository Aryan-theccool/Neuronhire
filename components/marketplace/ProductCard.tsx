import { formatCurrency } from '@/lib/utils'
import RazorpayButton from '../payments/RazorpayButton'

const CAT_COLORS: Record<string, string> = {
  agent: '#cc97ff',
  model: '#34b5fa',
  saas: '#10b981',
  workflow: '#f59e0b',
  dataset: '#ef4444',
  template: '#6d758c',
}

interface ProductCardProps {
  product: {
    id: string
    title?: string
    name?: string
    description: string
    category: string
    price_inr: number | null
    price_type?: string
    pricing_model?: string
    thumbnail_url?: string | null
    avg_rating?: number
    rating?: number
    total_sales?: number
    reviews_count?: number
    tech_stack?: string[]
    tags?: string[]
    demo_url?: string | null
    engineer?: {
      full_name: string
      avatar_url: string | null
      username: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  // Normalize fields between DB and Samples
  const title = product.title || product.name || 'AI Resource'
  const description = product.description
  const category = product.category.toLowerCase()
  const price = product.price_inr
  const model = (product.price_type || product.pricing_model || 'one-time').toLowerCase()
  const rating = product.rating || product.avg_rating || 0
  const sales = product.reviews_count || product.total_sales || 0
  const stack = product.tags || product.tech_stack || []

  const color = CAT_COLORS[category] || '#6d758c'
  const stars = Math.round(rating)

  return (
  return (
    <div className="glass-card-premium group" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Thumbnail / Header Area */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'var(--surface-container-low)', overflow: 'hidden' }}>
        {product.thumbnail_url ? (
          <img 
            src={product.thumbnail_url} 
            alt={title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
            className="group-hover:scale-110"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${color}22, var(--surface-container))` }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>{category}</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.25rem 0.75rem', background: color, color: '#000', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: `0 4px 12px ${color}44` }}>
          {category}
        </div>

        {/* Overlay for better text separation */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{title}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 800 }}>{rating}</span>
              <span>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
              <span style={{ color: 'var(--on-surface-variant)', marginLeft: '0.25rem', fontSize: '0.7rem' }}>({sales})</span>
            </div>
            {product.engineer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--primary-container)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>
                  {product.engineer.username[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                  by <span style={{ color: 'var(--primary)', fontWeight: 600 }}>@{product.engineer.username}</span>
                </span>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
              {price ? formatCurrency(price) : 'Free'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>{model}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {stack.slice(0, 3).map(s => (
            <span key={s} className="stack-chip stack-chip--sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.65rem', opacity: 0.8 }}>{s}</span>
          ))}
          {stack.length > 3 && <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', alignSelf: 'center' }}>+{stack.length - 3} more</span>}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
            Demo ↗
          </button>
          <div style={{ flex: 1 }}>
            {price && price > 0 ? (
              <RazorpayButton amountINR={price} buttonText="Get Now" />
            ) : (
              <button className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.8rem' }}>Download</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
  )
}
