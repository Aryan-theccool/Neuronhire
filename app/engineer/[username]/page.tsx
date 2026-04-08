import NeuronScoreRing from '@/components/profile/NeuronScoreRing'
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
  const engineer = DEMO;

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
              {engineer.hourly_rate_inr ? '\u20B9' + engineer.hourly_rate_inr + '/hr' : ''}
            </span>
          </div>
        </div>
        <div className="profile-hero__right">
          <h1>{engineer.full_name}</h1>
          <p style={{color:'var(--on-surface-variant)',fontSize:'0.9rem'}}>@{engineer.username} · {engineer.location}</p>
          <p className="profile-bio">{engineer.bio}</p>
          <p className="profile-philosophy">&quot;{engineer.ai_philosophy}&quot;</p>
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
