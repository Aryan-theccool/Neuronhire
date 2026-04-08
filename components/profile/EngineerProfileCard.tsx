import NeuronScoreRing from './NeuronScoreRing'

interface EngineerProfileCardProps {
  engineer: {
    username: string
    full_name: string | null
    avatar_url: string | null
    neuron_score: number
    ai_stack: string[]
    is_available: boolean
    specializations: string[]
  }
}

export default function EngineerProfileCard({ engineer }: EngineerProfileCardProps) {
  return (
    <div className="engineer-card">
      <div className="engineer-card__header">
        <div className="engineer-card__avatar">
          {engineer.avatar_url ? (
            <img src={engineer.avatar_url} alt={engineer.full_name || ''} />
          ) : (
            <div className="engineer-card__avatar-placeholder">
              {(engineer.full_name || engineer.username)[0]?.toUpperCase()}
            </div>
          )}
          {engineer.is_available && <span className="availability-dot" />}
        </div>
        <div className="engineer-card__info">
          <h3>{engineer.full_name || engineer.username}</h3>
          <p className="engineer-card__username">@{engineer.username}</p>
        </div>
        <NeuronScoreRing score={engineer.neuron_score} size={64} />
      </div>
      <div className="engineer-card__stack">
        {engineer.ai_stack?.slice(0, 4).map(skill => (
          <span key={skill} className="stack-chip">{skill}</span>
        ))}
      </div>
    </div>
  )
}
