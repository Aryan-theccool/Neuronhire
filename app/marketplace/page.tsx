import ProductCard from '@/components/marketplace/ProductCard'

const PRODUCTS = [
  { id: '1', name: 'DocuRAG Pro', description: 'Production-ready RAG pipeline with multi-format document ingestion, hybrid search, and citation generation.', category: 'agent', price_inr: 4999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.7, total_sales: 89, tech_stack: ['LangChain','FAISS','FastAPI'], demo_url: 'https://demo.example.com' },
  { id: '2', name: 'InvoiceScan ML', description: 'Fine-tuned vision model for Indian invoice extraction. 96% accuracy on GST invoices.', category: 'model', price_inr: 12999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.3, total_sales: 34, tech_stack: ['PyTorch','Transformers','ONNX'], demo_url: null },
  { id: '3', name: 'AutoReply Agent', description: 'Customer email auto-reply agent powered by GPT-4. Handles 80% of routine inquiries autonomously.', category: 'agent', price_inr: 1999, pricing_model: 'monthly', thumbnail_url: null, avg_rating: 4.5, total_sales: 156, tech_stack: ['OpenAI','Node.js','Redis'], demo_url: 'https://demo.example.com' },
  { id: '4', name: 'MLOps Starter Kit', description: 'Complete MLOps template with CI/CD, model registry, A/B testing, and monitoring.', category: 'template', price_inr: 2499, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.2, total_sales: 67, tech_stack: ['MLflow','Docker','GitHub Actions'], demo_url: null },
  { id: '5', name: 'SentimentStream', description: 'Real-time social media sentiment analysis SaaS. Supports Twitter, Reddit, and YouTube.', category: 'saas', price_inr: 999, pricing_model: 'monthly', thumbnail_url: null, avg_rating: 3.9, total_sales: 203, tech_stack: ['Python','Kafka','Transformers'], demo_url: 'https://demo.example.com' },
  { id: '6', name: 'Indian NER Dataset', description: '50,000 annotated sentences with named entities for Indian languages.', category: 'dataset', price_inr: 7999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.8, total_sales: 28, tech_stack: ['SpaCy','Hugging Face'], demo_url: null },
  { id: '7', name: 'AutoML Workflow', description: 'No-code ML pipeline builder. Connect data, train, and deploy via visual workflow.', category: 'workflow', price_inr: 0, pricing_model: 'free', thumbnail_url: null, avg_rating: 4.1, total_sales: 412, tech_stack: ['Streamlit','Scikit-learn','Pandas'], demo_url: 'https://demo.example.com' },
  { id: '8', name: 'VoiceClone Studio', description: 'Clone any voice with 30 seconds of audio. Supports 12 Indian languages.', category: 'saas', price_inr: 4999, pricing_model: 'monthly', thumbnail_url: null, avg_rating: 4.6, total_sales: 71, tech_stack: ['Coqui TTS','PyTorch','FastAPI'], demo_url: 'https://demo.example.com' },
];

export default function MarketplacePage() {
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
          {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  )
}
