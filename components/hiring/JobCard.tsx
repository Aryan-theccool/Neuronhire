import { formatINR } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  fulltime: '#10b981',
  internship: '#f59e0b',
  hourly: '#0ea5e9',
  project: '#a855f7',
}

interface JobCardProps {
  job: {
    id: string
    title: string
    engagement_type: string
    skills_required: string[]
    budget_min_inr: number | null
    budget_max_inr: number | null
    min_neuron_score: number
    company?: { company_name: string; logo_url: string | null }
  }
}

export default function JobCard({ job }: JobCardProps) {
  const color = TYPE_COLORS[job.engagement_type] || '#6b7280'
  return (
    <div className="job-card">
      <div className="job-card__top">
        <span className="engagement-badge" style={{ borderColor: color, color }}>
          {job.engagement_type.replace('_', ' ')}
        </span>
        {job.min_neuron_score > 0 && (
          <span className="neuron-req">NS {job.min_neuron_score}+</span>
        )}
      </div>
      <h3 className="job-card__title">{job.title}</h3>
      {job.company && <p className="job-card__company">{job.company.company_name}</p>}
      <div className="job-card__budget">
        {job.budget_min_inr && job.budget_max_inr
          ? `${formatINR(job.budget_min_inr)} - ${formatINR(job.budget_max_inr)}`
          : 'Budget flexible'}
      </div>
      <div className="job-card__skills">
        {job.skills_required?.map(s => <span key={s} className="stack-chip">{s}</span>)}
      </div>
      <button className="btn-primary">View & Apply</button>
    </div>
  )
}
