import JobCard from '@/components/hiring/JobCard'

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
