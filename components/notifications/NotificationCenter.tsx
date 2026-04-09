'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // In this MVP, we derive notifications from proposals/contracts/bounties
      // For a real app, we'd have a specific notifications table
      const { data } = await supabase
        .from('proposals')
        .select('*, job:job_postings(title)')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) setNotifications(data)
    }

    fetchNotifications()
  }, [])

  return (
    <div style={{position: 'relative'}}>
      <button 
        onClick={() => {
          setIsOpen(!isOpen)
          setHasNew(false)
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--on-surface)',
          cursor: 'pointer',
          fontSize: '1.2rem',
          position: 'relative',
          padding: '0.5rem'
        }}
      >
        🔔
        {hasNew && <span style={{
          position: 'absolute',
          top: '0.2rem',
          right: '0.2rem',
          width: '8px',
          height: '8px',
          background: 'var(--primary)',
          borderRadius: '50%'
        }} />}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '300px',
          background: 'var(--surface-container-high)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          marginTop: '0.5rem',
          zIndex: 100,
          padding: '1rem'
        }}>
          <h4 style={{marginBottom: '1rem'}}>Recent Activity</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {notifications.map(n => (
              <div key={n.id} style={{fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--outline-variant)'}}>
                <p>New application for <strong>{n.job?.title}</strong></p>
                <span style={{fontSize: '0.75rem', color: 'var(--on-surface-variant)'}}>
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {notifications.length === 0 && <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>No new notifications.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
