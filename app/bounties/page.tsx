import BountyCard from '@/components/hiring/BountyCard'

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
