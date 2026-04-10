'use client'

interface HireButtonsProps {
  username: string
}

export default function HireButtons({ username }: HireButtonsProps) {
  return (
    <>
      <button 
        className="btn-primary" 
        style={{width: '100%', marginBottom: '0.5rem'}}
        onClick={() => alert(`Invitation sent to ${username}!`)}
      >
        Invite to Job
      </button>
      <button className="btn-secondary" style={{width: '100%'}}>Message</button>
    </>
  )
}
