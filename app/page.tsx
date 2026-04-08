import Link from 'next/link'
import EngineerProfileCard from '@/components/profile/EngineerProfileCard'
import JobCard from '@/components/hiring/JobCard'
import BountyCard from '@/components/hiring/BountyCard'
import ProductCard from '@/components/marketplace/ProductCard'

const DEMO_ENGINEERS = [
  { username: 'arjun_ml', full_name: 'Arjun Sharma', avatar_url: null, neuron_score: 940, ai_stack: ['Python','LangChain','FastAPI','PostgreSQL'], is_available: true, specializations: ['RAG','Fine-tuning'] },
  { username: 'priya_mlops', full_name: 'Priya Nair', avatar_url: null, neuron_score: 790, ai_stack: ['Python','MLflow','Docker','K8s'], is_available: true, specializations: ['MLOps'] },
  { username: 'rohan_agents', full_name: 'Rohan Verma', avatar_url: null, neuron_score: 620, ai_stack: ['Python','AutoGen','CrewAI','Redis'], is_available: false, specializations: ['AI Agents'] },
];

const DEMO_JOBS = [
  { id: '1', title: 'Senior LLM Engineer', engagement_type: 'fulltime', skills_required: ['LangChain','Python','RAG'], budget_min_inr: 2500000, budget_max_inr: 4000000, min_neuron_score: 700, company: { company_name: 'NovaMind AI', logo_url: null } },
  { id: '2', title: 'AI Intern — CV', engagement_type: 'internship', skills_required: ['PyTorch','OpenCV','Python'], budget_min_inr: 15000, budget_max_inr: 25000, min_neuron_score: 200, company: { company_name: 'VisionLabs', logo_url: null } },
];

const DEMO_BOUNTIES = [
  { id: '1', title: 'Build AI support agent', problem_description: 'We need an AI agent that handles tier-1 support: answers FAQs, creates tickets, escalates edge cases.', reward_inr: 200000, skills_needed: ['LangChain','Python','FastAPI'], deadline: new Date(Date.now() + 14*86400000).toISOString(), status: 'open' },
];

const DEMO_PRODUCTS = [
  { id: '1', name: 'DocuRAG Pro', description: 'Production-ready RAG pipeline with multi-format document ingestion and citation generation.', category: 'agent', price_inr: 4999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.7, total_sales: 89, tech_stack: ['LangChain','FAISS','FastAPI'], demo_url: 'https://demo.example.com' },
  { id: '2', name: 'InvoiceScan ML', description: 'Fine-tuned vision model for Indian invoice extraction. 96% accuracy on GST invoices.', category: 'model', price_inr: 12999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.3, total_sales: 34, tech_stack: ['PyTorch','Transformers','ONNX'], demo_url: null },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>{"India's Premier AI Talent & Marketplace"}</h1>
        <p>Build. Be Found. Get Paid. Build Again. The platform where elite AI engineers meet world-class companies.</p>
        <div className="hero__actions">
          <Link href="/signup" className="btn-primary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Join as Engineer</Link>
          <Link href="/signup" className="btn-secondary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Hire AI Talent</Link>
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
          {DEMO_ENGINEERS.map(e => <EngineerProfileCard key={e.username} engineer={e} />)}
        </div>

        <h2 className="section-title">Latest Opportunities</h2>
        <div className="grid-2" style={{marginBottom: '3rem'}}>
          {DEMO_JOBS.map(j => <JobCard key={j.id} job={j} />)}
        </div>

        <h2 className="section-title">Active Bounties</h2>
        <div className="grid-2" style={{marginBottom: '3rem'}}>
          {DEMO_BOUNTIES.map(b => <BountyCard key={b.id} bounty={b} />)}
        </div>

        <h2 className="section-title">AI Product Marketplace</h2>
        <div className="grid-3" style={{marginBottom: '3rem'}}>
          {DEMO_PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </>
  )
}
