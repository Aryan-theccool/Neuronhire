interface SkillBadgeProps {
  badge_type: string
  verified: boolean
}

export default function SkillBadge({ badge_type, verified }: SkillBadgeProps) {
  return (
    <span className={`skill-badge ${verified ? 'skill-badge--verified' : 'skill-badge--unverified'}`}>
      {verified && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {badge_type}
    </span>
  )
}
