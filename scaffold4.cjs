const fs = require('fs');
const path = require('path');
function w(f, c) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
}

// === app/layout.tsx ===
w('app/layout.tsx',
`import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'NeuralHire — India\\'s AI Talent & Marketplace Platform',
  description: 'Build. Be Found. Get Paid. Build Again. The premier marketplace connecting AI engineers with companies seeking AI talent.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav__logo">NeuralHire</Link>
          <div className="nav__links">
            <Link href="/jobs" className="nav__link">Jobs</Link>
            <Link href="/bounties" className="nav__link">Bounties</Link>
            <Link href="/marketplace" className="nav__link">Marketplace</Link>
            <Link href="/login" className="nav__link">Login</Link>
            <Link href="/signup" className="btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>Sign Up</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
`);

// === app/page.tsx (Landing) ===
w('app/page.tsx',
`import Link from 'next/link'
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
  { id: '1', title: 'Senior LLM Engineer — RAG Pipeline', engagement_type: 'fulltime', skills_required: ['LangChain','Python','RAG'], budget_min_inr: 2500000, budget_max_inr: 4000000, min_neuron_score: 700, company: { company_name: 'NovaMind AI', logo_url: null } },
  { id: '2', title: 'AI Intern — Computer Vision', engagement_type: 'internship', skills_required: ['PyTorch','OpenCV','Python'], budget_min_inr: 15000, budget_max_inr: 25000, min_neuron_score: 200, company: { company_name: 'VisionLabs', logo_url: null } },
];

const DEMO_BOUNTIES = [
  { id: '1', title: 'Build AI customer support agent for SaaS', problem_description: 'We need an AI agent that handles tier-1 support: answers FAQs, creates tickets, escalates edge cases. Must integrate with Intercom and our PostgreSQL knowledge base.', reward_inr: 200000, skills_needed: ['LangChain','Python','FastAPI'], deadline: new Date(Date.now() + 14*86400000).toISOString(), status: 'open' },
];

const DEMO_PRODUCTS = [
  { id: '1', name: 'DocuRAG Pro', description: 'Production-ready RAG pipeline with multi-format document ingestion, hybrid search, and citation generation.', category: 'agent', price_inr: 4999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.7, total_sales: 89, tech_stack: ['LangChain','FAISS','FastAPI'], demo_url: 'https://demo.example.com' },
  { id: '2', name: 'InvoiceScan ML', description: 'Fine-tuned vision model for Indian invoice extraction. 96% accuracy on GST invoices.', category: 'model', price_inr: 12999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.3, total_sales: 34, tech_stack: ['PyTorch','Transformers','ONNX'], demo_url: null },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>India\\'s Premier AI Talent & Marketplace</h1>
        <p>Build. Be Found. Get Paid. Build Again. The platform where elite AI engineers meet world-class companies.</p>
        <div className="hero__actions">
          <Link href="/signup" className="btn-primary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Join as Engineer</Link>
          <Link href="/signup" className="btn-secondary" style={{padding: '0.75rem 2rem', fontSize: '1rem'}}>Hire AI Talent</Link>
        </div>
      </section>

      <div className="stat-bar">
        <div className="stat-card">
          <div className="stat-card__number">2,400+</div>
          <div className="stat-card__label">AI Engineers</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">580+</div>
          <div className="stat-card__label">Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">\\u20B94.2Cr</div>
          <div className="stat-card__label">Bounties Paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">320+</div>
          <div className="stat-card__label">AI Products</div>
        </div>
      </div>

      <div className="page-container">
        <div className="page-header">
          <h2 className="section-title">Top Engineers</h2>
        </div>
        <div className="grid-3" style={{marginBottom: '3rem'}}>
          {DEMO_ENGINEERS.map(e => <EngineerProfileCard key={e.username} engineer={e} />)}
        </div>

        <div className="page-header">
          <h2 className="section-title">Latest Opportunities</h2>
        </div>
        <div className="grid-2" style={{marginBottom: '3rem'}}>
          {DEMO_JOBS.map(j => <JobCard key={j.id} job={j} />)}
        </div>

        <div className="page-header">
          <h2 className="section-title">Active Bounties</h2>
        </div>
        <div className="grid-2" style={{marginBottom: '3rem'}}>
          {DEMO_BOUNTIES.map(b => <BountyCard key={b.id} bounty={b} />)}
        </div>

        <div className="page-header">
          <h2 className="section-title">AI Product Marketplace</h2>
        </div>
        <div className="grid-3" style={{marginBottom: '3rem'}}>
          {DEMO_PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </>
  )
}
`);

// === app/jobs/page.tsx ===
w('app/jobs/page.tsx',
`import JobCard from '@/components/hiring/JobCard'

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

// === app/bounties/page.tsx ===
w('app/bounties/page.tsx',
`import BountyCard from '@/components/hiring/BountyCard'

const BOUNTIES = [
  { id: '1', title: 'Build AI customer support agent for SaaS product', problem_description: 'We need an AI agent that handles tier-1 support: answers FAQs, creates tickets, escalates edge cases. Must integrate with Intercom and our PostgreSQL knowledge base.', reward_inr: 200000, skills_needed: ['LangChain','Python','FastAPI'], deadline: new Date(Date.now() + 14*86400000).toISOString(), status: 'open' },
  { id: '2', title: 'Improve invoice OCR accuracy from 76% to 95%+', problem_description: 'Current pipeline uses Tesseract. Need to fine-tune a vision model on our invoice dataset (5000 labeled samples provided). Target: 95%+ field extraction accuracy.', reward_inr: 75000, skills_needed: ['Python','PyTorch','Computer Vision'], deadline: new Date(Date.now() + 21*86400000).toISOString(), status: 'open' },
  { id: '3', title: 'Create RAG pipeline for 10K legal documents', problem_description: 'Build a retrieval-augmented generation system that can ingest 10,000 Indian legal documents and answer queries with citations. Must handle Hindi + English.', reward_inr: 150000, skills_needed: ['LangChain','FAISS','Python','NLP'], deadline: new Date(Date.now() + 10*86400000).toISOString(), status: 'open' },
  { id: '4', title: 'Fine-tune Whisper for Indian accented English', problem_description: 'Improve speech recognition accuracy for Indian English accents across 5 regional varieties. We provide 200hrs of labeled audio data.', reward_inr: 100000, skills_needed: ['Whisper','PyTorch','Audio ML'], deadline: new Date(Date.now() + 28*86400000).toISOString(), status: 'open' },
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

// === app/marketplace/page.tsx ===
w('app/marketplace/page.tsx',
`import ProductCard from '@/components/marketplace/ProductCard'

const PRODUCTS = [
  { id: '1', name: 'DocuRAG Pro', description: 'Production-ready RAG pipeline with multi-format document ingestion, hybrid search, and citation generation. Supports PDF, DOCX, and HTML.', category: 'agent', price_inr: 4999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.7, total_sales: 89, tech_stack: ['LangChain','FAISS','FastAPI'], demo_url: 'https://demo.example.com' },
  { id: '2', name: 'InvoiceScan ML', description: 'Fine-tuned vision model for Indian invoice extraction. 96% accuracy on GST invoices with field-level confidence scores.', category: 'model', price_inr: 12999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.3, total_sales: 34, tech_stack: ['PyTorch','Transformers','ONNX'], demo_url: null },
  { id: '3', name: 'AutoReply Agent', description: 'Customer email auto-reply agent powered by GPT-4. Learns your tone and handles 80% of routine inquiries autonomously.', category: 'agent', price_inr: 1999, pricing_model: 'monthly', thumbnail_url: null, avg_rating: 4.5, total_sales: 156, tech_stack: ['OpenAI','Node.js','Redis'], demo_url: 'https://demo.example.com' },
  { id: '4', name: 'MLOps Starter Kit', description: 'Complete MLOps template with CI/CD, model registry, A/B testing, and monitoring. Deploy models to production in under 30 minutes.', category: 'template', price_inr: 2499, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.2, total_sales: 67, tech_stack: ['MLflow','Docker','GitHub Actions'], demo_url: null },
  { id: '5', name: 'SentimentStream', description: 'Real-time social media sentiment analysis SaaS. Supports Twitter, Reddit, and YouTube comments with multilingual analysis.', category: 'saas', price_inr: 999, pricing_model: 'monthly', thumbnail_url: null, avg_rating: 3.9, total_sales: 203, tech_stack: ['Python','Kafka','Transformers'], demo_url: 'https://demo.example.com' },
  { id: '6', name: 'Indian NER Dataset', description: '50,000 annotated sentences with named entities for Indian languages (Hindi, Tamil, Telugu, Bengali). Perfect for fine-tuning NER models.', category: 'dataset', price_inr: 7999, pricing_model: 'one_time', thumbnail_url: null, avg_rating: 4.8, total_sales: 28, tech_stack: ['SpaCy','Hugging Face'], demo_url: null },
  { id: '7', name: 'AutoML Workflow', description: 'No-code ML pipeline builder. Connect data sources, select models, train, and deploy — all through a visual workflow editor.', category: 'workflow', price_inr: 0, pricing_model: 'free', thumbnail_url: null, avg_rating: 4.1, total_sales: 412, tech_stack: ['Streamlit','Scikit-learn','Pandas'], demo_url: 'https://demo.example.com' },
  { id: '8', name: 'VoiceClone Studio', description: 'Clone any voice with 30 seconds of audio. Supports 12 Indian languages with natural prosody and emotion control.', category: 'saas', price_inr: 4999, pricing_model: 'monthly', thumbnail_url: null, avg_rating: 4.6, total_sales: 71, tech_stack: ['Coqui TTS','PyTorch','FastAPI'], demo_url: 'https://demo.example.com' },
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

// === app/(auth)/login/page.tsx ===
w('app/(auth)/login/page.tsx',
\`'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Supabase auth
    alert('Login with: ' + email)
  }

  return (
    <div style={{maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Welcome Back</h1>
      <p style={{textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>Sign in to your NeuralHire account</p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>Sign In</button>
      </form>
      <div style={{textAlign: 'center', margin: '1.5rem 0', color: 'var(--outline)'}}>or</div>
      <button className="btn-secondary" style={{width: '100%', marginBottom: '0.75rem'}}>Continue with GitHub</button>
      <button className="btn-secondary" style={{width: '100%'}}>Continue with Google</button>
      <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  )
}
\`);

// === app/(auth)/signup/page.tsx ===
w('app/(auth)/signup/page.tsx',
\`'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [role, setRole] = useState<'engineer' | 'company'>('engineer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Signup as ' + role + ': ' + email)
  }

  return (
    <div style={{maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Join NeuralHire</h1>
      <p style={{textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '2rem'}}>Start your AI career or find top AI talent</p>

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button
          className={role === 'engineer' ? 'btn-primary' : 'btn-secondary'}
          style={{flex: 1}} onClick={() => setRole('engineer')}>
          I'm an Engineer
        </button>
        <button
          className={role === 'company' ? 'btn-primary' : 'btn-secondary'}
          style={{flex: 1}} onClick={() => setRole('company')}>
          I'm a Company
        </button>
      </div>

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} />
        </div>
        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>
          Create {role === 'engineer' ? 'Engineer' : 'Company'} Account
        </button>
      </form>
      <div style={{textAlign: 'center', margin: '1.5rem 0', color: 'var(--outline)'}}>or</div>
      <button className="btn-secondary" style={{width: '100%', marginBottom: '0.75rem'}}>Continue with GitHub</button>
      <button className="btn-secondary" style={{width: '100%'}}>Continue with Google</button>
      <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
        Already have an account? <Link href="/login">Sign In</Link>
      </p>
    </div>
  )
}
\`);

// === app/engineer/[username]/page.tsx ===
w('app/engineer/[username]/page.tsx',
\`import NeuronScoreRing from '@/components/profile/NeuronScoreRing'
import SkillBadge from '@/components/profile/SkillBadge'

const DEMO = {
  username: 'arjun_ml',
  full_name: 'Arjun Sharma',
  bio: 'LLM engineer building production RAG systems. 4+ years shipping AI products at scale. Passionate about making AI accessible for Indian enterprises.',
  location: 'Bangalore, India',
  ai_philosophy: 'The best AI system is the one that makes itself unnecessary by empowering humans to solve their own problems.',
  github_url: 'https://github.com/arjun-ml',
  linkedin_url: 'https://linkedin.com/in/arjun-ml',
  ai_stack: ['Python', 'LangChain', 'FastAPI', 'PostgreSQL', 'PyTorch', 'Docker'],
  specializations: ['RAG', 'Fine-tuning', 'LLM Deployment'],
  neuron_score: 940,
  hourly_rate_inr: 3500,
  badges: [
    { badge_type: 'LLM Fundamentals', verified: true },
    { badge_type: 'RAG Architect', verified: true },
    { badge_type: 'MLOps', verified: true },
    { badge_type: 'Fine-tuning', verified: false },
  ],
  projects: [
    { title: 'LegalRAG — AI Legal Assistant', problem: 'Indian lawyers spend 60% of time on document review. No existing tool handles Indian legal corpus effectively.', approach: 'Built a RAG pipeline with hybrid search (BM25 + FAISS) over 50K court judgments. Used LangChain with custom citation chains.', outcome: 'Reduced document review time by 70%. Deployed for 3 law firms with 94% answer accuracy.', tech_stack: ['LangChain','FAISS','FastAPI','React'] },
    { title: 'MedTranscribe — Clinical Note Generator', problem: 'Doctors dictate notes in mixed Hindi-English. No existing ASR + NLU pipeline handles code-switching accurately.', approach: 'Fine-tuned Whisper on 500hrs of Indian medical dictation. Built NLU layer for structured SOAP note extraction.', outcome: 'Achieved 92% transcription accuracy on code-switched audio. Deployed across 5 clinics saving 2hrs/doctor/day.', tech_stack: ['Whisper','PyTorch','FastAPI','PostgreSQL'] },
  ]
};

export default async function EngineerProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const engineer = DEMO; // In production: fetch from Supabase by username

  return (
    <div className="page-container">
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-avatar">
            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, var(--primary-dim), var(--primary))',color:'#000',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'2.5rem'}}>
              {engineer.full_name[0]}
            </div>
          </div>
          <NeuronScoreRing score={engineer.neuron_score} size={160} breakdown={{projects:280,assessments:160,ratings:200,marketplace:150,community:150}} />
          <div style={{textAlign:'center'}}>
            <span style={{color:'var(--secondary)',fontFamily:'var(--font-display)',fontWeight:600}}>
              {engineer.hourly_rate_inr ? '\\u20B9' + engineer.hourly_rate_inr + '/hr' : ''}
            </span>
          </div>
        </div>
        <div className="profile-hero__right">
          <h1>{engineer.full_name}</h1>
          <p style={{color:'var(--on-surface-variant)',fontSize:'0.9rem'}}>@{engineer.username} · {engineer.location}</p>
          <p className="profile-bio">{engineer.bio}</p>
          <p className="profile-philosophy">"{engineer.ai_philosophy}"</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            {engineer.ai_stack.map(s => <span key={s} className="stack-chip">{s}</span>)}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
            {engineer.badges.map(b => <SkillBadge key={b.badge_type} badge_type={b.badge_type} verified={b.verified} />)}
          </div>
          <div className="profile-links">
            {engineer.github_url && <a href={engineer.github_url} target="_blank" rel="noopener">GitHub</a>}
            {engineer.linkedin_url && <a href={engineer.linkedin_url} target="_blank" rel="noopener">LinkedIn</a>}
          </div>
        </div>
      </div>

      <h2 className="section-title">Case Studies</h2>
      {engineer.projects.map(p => (
        <div key={p.title} className="project-case-study">
          <h3>{p.title}</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.375rem',marginBottom:'1rem'}}>
            {p.tech_stack.map(s => <span key={s} className="stack-chip stack-chip--sm">{s}</span>)}
          </div>
          <div className="case-study-section"><h4>Problem</h4><p>{p.problem}</p></div>
          <div className="case-study-section"><h4>Approach</h4><p>{p.approach}</p></div>
          <div className="case-study-section"><h4>Outcome</h4><p>{p.outcome}</p></div>
        </div>
      ))}
    </div>
  )
}
\`);

// === app/api/neuron-score/route.ts ===
w('app/api/neuron-score/route.ts',
\`import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: Wire Supabase + calculateNeuronScore
  return NextResponse.json({ score: 940, message: 'NeuronScore recalculated' })
}
\`);

// === app/api/payments/create-order/route.ts ===
w('app/api/payments/create-order/route.ts',
\`import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { amount_inr, contract_id } = await request.json()
  // TODO: Wire Razorpay
  return NextResponse.json({ order_id: 'order_test_' + Date.now(), amount: amount_inr * 100 })
}
\`);

// === app/api/proposals/notify/route.ts ===
w('app/api/proposals/notify/route.ts',
\`import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  // TODO: Wire Resend email
  console.log('Proposal notification:', body)
  return NextResponse.json({ sent: true })
}
\`);

console.log('All pages and API routes done!');

