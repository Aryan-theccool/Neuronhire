import { formatCurrency } from '@/lib/utils'
import RazorpayButton from '../payments/RazorpayButton'

const CAT_COLORS: Record<string, string> = {
  agent: '#a855f7',
  model: '#0ea5e9',
  saas: '#10b981',
  workflow: '#f59e0b',
  dataset: '#ef4444',
  template: '#6366f1',
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    category: string
    price_inr: number | null
    pricing_model: string | null
    thumbnail_url: string | null
    avg_rating: number
    total_sales: number
    tech_stack: string[]
    demo_url: string | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const color = CAT_COLORS[product.category] || '#6b7280'
  const stars = Math.round(product.avg_rating)
  return (
    <div className="product-card group">
      <div className="product-card__thumb">
        {product.thumbnail_url
          ? <img src={product.thumbnail_url} alt={product.name} />
          : <div className="product-card__thumb-placeholder">{product.category}</div>}
        <span className="category-badge" style={{ background: color }}>{product.category}</span>
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.description.slice(0, 80)}...</p>
        <div className="product-card__meta">
          <span className="product-card__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span className="product-card__price">
            {product.pricing_model === 'free' ? 'Free' : product.price_inr ? formatCurrency(product.price_inr) : 'Contact'}
          </span>
        </div>
        <div className="product-card__stack group-hover:opacity-100">
          {product.tech_stack?.map(s => <span key={s} className="stack-chip stack-chip--sm">{s}</span>)}
        </div>
        <div className="product-card__actions">
          {product.demo_url && <button className="btn-secondary">Try Demo</button>}
          {product.pricing_model !== 'free' && product.price_inr ? (
            <div style={{ flex: 1 }}><RazorpayButton amountINR={product.price_inr} buttonText="Buy Now" /></div>
          ) : (
            <button className="btn-primary" style={{ flex: 1 }}>Get Code</button>
          )}
        </div>
      </div>
    </div>
  )
}
