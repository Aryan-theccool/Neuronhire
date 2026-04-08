const fs = require('fs');
const path = require('path');
function w(f, c) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
}

w('app/page.tsx', `import Link from 'next/link'
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
        <div className="stat-card"><div className="stat-card__number">{"\u20B9"}4.2Cr</div><div className="stat-card__label">Bounties Paid</div></div>
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
`);

w('app/jobs/page.tsx', `import JobCard from '@/components/hiring/JobCard'

const JOBS = [
  { id: '1', title: 'Senior LLM Engineer — RAG Pipeline', engagement_type: 'fulltime', skills_required: ['LangChain','Python','RAG','PostgreSQL'], budget_min_inr: 2500000, budget_max_inr: 4000000, min_neuron_score: 700, company: { company_name: 'NovaMind AI', logo_url: null } },
  { id: '2', title: 'AI Intern — Computer Vision R&D', engagement_type: 'internship', skills_required: ['PyTorch','OpenCV','Python'], budget_min_inr: 15000, budget_max_inr: 25000, min_neuron_score: 200, company: { company_name: 'VisionLabs', logo_url: null } },
  { id: '3', title: 'Hourly — Fine-tune Llama 3 on Medical Data', engagement_type: 'hourly', skills_required: ['Transformers','LoRA','Python','PEFT'], budget_min_inr: 3000, budget_max_inr: 6000, min_neuron_score: 500, company: { company_name: 'MedAI Corp', logo_url: null } },
  { id: '4', title: 'Build Multi-Agent Workflow for Legal Review', engagement_type: 'project', skills_required: ['AutoGen','CrewAI','LangGraph','Python'], budget_min_inr: 150000, budget_max_inr: 300000, min_neuron_score: 600, company: { company_name: 'LegalEase AI', logo_url: null } },
  { id: '5', title: 'MLOps Engineer — Production Model Serving', engagement_type: 'fulltime', skills_required: ['MLflow','Docker','K8s','FastAPI'], budget_min_inr: 1800000, budget_max_inr: 3200000, min_neuron_score: 500, company: { company_name: 'ScaleStack', logo_url: null } },
  { id: '6', title: 'AI Product Manager Intern', engagement_type: 'internship', skills_required: ['Product Strategy','AI/ML','Data Analysis'], budget_min_inr: 20000, budget_max_inr: 35000, min_neuron_score: 100, company: { company_name: 'Buildr AI', logo_url: null } },
];

export default function JobsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Jobs & Contracts</h1>
        <p>Find your next AI role — full-time, internship, hourly, or project-based.</p>
      </div>
      <div className="sidebar-layout">
        <aside className="filters">
          <div className="filter-group">
            <h3>Engagement Type</h3>
            {['Full-time','Internship','Hourly','Project'].map(t => (
              <label key={t} className="filter-option">
                <input type="checkbox" defaultChecked /> {t}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Skills</h3>
            {['Python','LangChain','PyTorch','RAG','MLOps','AutoGen'].map(s => (
              <label key={s} className="filter-option">
                <input type="checkbox" /> {s}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Min NeuronScore</h3>
            <input type="range" min="0" max="1000" step="100" defaultValue="0"
              style={{width:'100%', accentColor: 'var(--primary)'}} />
          </div>
        </aside>
        <div className="grid-2">
          {JOBS.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </div>
  )
}
`);

w('app/bounties/page.tsx', `import BountyCard from '@/components/hiring/BountyCard'

const BOUNTIES = [
  { id: '1', title: 'Build AI customer support agent for SaaS product', problem_description: 'We need an AI agent that handles tier-1 support: answers FAQs, creates tickets, escalates edge cases. Must integrate with Intercom and our PostgreSQL knowledge base.', reward_inr: 200000, skills_needed: ['LangChain','Python','FastAPI'], deadline: new Date(Date.now() + 14*86400000).toISOString(), status: 'open' },
  { id: '2', title: 'Improve invoice OCR accuracy from 76% to 95%+', problem_description: 'Current pipeline uses Tesseract. Need to fine-tune a vision model on our invoice dataset (5000 labeled samples provided). Target: 95%+ field extraction accuracy.', reward_inr: 75000, skills_needed: ['Python','PyTorch','Computer Vision'], deadline: new Date(Date.now() + 21*86400000).toISOString(), status: 'open' },
  { id: '3', title: 'Create RAG pipeline for 10K legal documents', problem_description: 'Build a retrieval-augmented generation system for 10,000 Indian legal documents with citations. Must handle Hindi + English.', reward_inr: 150000, skills_needed: ['LangChain','FAISS','Python','NLP'], deadline: new Date(Date.now() + 10*86400000).toISOString(), status: 'open' },
  { id: '4', title: 'Fine-tune Whisper for Indian accented English', problem_description: 'Improve speech recognition for Indian English accents across 5 regional varieties. We provide 200hrs of labeled audio data.', reward_inr: 100000, skills_needed: ['Whisper','PyTorch','Audio ML'], deadline: new Date(Date.now() + 28*86400000).toISOString(), status: 'open' },
];

export default function BountiesPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bounty Board</h1>
        <p>Solve challenging AI problems. Win real rewards.</p>
      </div>
      <div className="grid-2">
        {BOUNTIES.map(b => <BountyCard key={b.id} bounty={b} />)}
      </div>
    </div>
  )
}
`);

w('app/marketplace/page.tsx', `import ProductCard from '@/components/marketplace/ProductCard'

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
`);

console.log('All pages done!');
