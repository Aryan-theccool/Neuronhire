'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendHandshakeMessage, finalizeHire } from '@/app/dashboard/handshake-actions'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export function HandshakeTerminal({ roomId, initialMessages, user, room }: any) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Real-time listener
  useEffect(() => {
    const channel = supabase
      .channel(`handshake:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'handshake_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!inputText.trim()) return
    
    const text = inputText
    setInputText('')
    const res = await sendHandshakeMessage(roomId, text)
    if (res?.error) {
      alert(res.error)
      setInputText(text) // Restore on error
    }
  }

  async function handleFinalize() {
    if (!confirm('EXECUTE CONTRACT: This will finalize the hire and start the formal engagement. Proceed?')) return
    setLoading(true)
    const res = await finalizeHire(roomId)
    setLoading(false)
    if (res?.error) alert(res.error)
    else {
      alert('CONTRACT EXECUTED. Moving to Active Contracts.')
      router.push('/dashboard')
    }
  }

  return (
    <div className="handshake-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>
      {/* CHANT TERMINAL */}
      <div className="glass-card-premium" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '1.5rem', 
        overflow: 'hidden',
        border: '1px solid rgba(173, 198, 255, 0.1)'
      }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hide-scroll">
          {messages.map((m) => (
            <div 
              key={m.id} 
              style={{ 
                alignSelf: m.sender_id === user.id ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <div style={{ 
                fontSize: '0.65rem', 
                opacity: 0.5, 
                textTransform: 'uppercase', 
                fontWeight: 800,
                textAlign: m.sender_id === user.id ? 'right' : 'left'
              }}>
                {m.sender_id === user.id ? 'YOU' : 'COLLABORATOR'} — {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ 
                background: m.content.startsWith('SYSTEM:') ? 'rgba(0,0,0,0.5)' : m.sender_id === user.id ? 'var(--primary-container)' : 'rgba(255,255,255,0.05)',
                color: m.content.startsWith('SYSTEM:') ? 'var(--primary)' : '#fff',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                border: m.content.startsWith('SYSTEM:') ? '1px dashed var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                fontFamily: m.content.startsWith('SYSTEM:') ? 'monospace' : 'inherit'
              }}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your transmission..."
            className="modern-input"
            style={{ flex: 1, background: 'rgba(0,0,0,0.3)' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }}>Send</button>
        </form>
      </div>

      {/* INTELLIGENCE SIDEBAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card-premium" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Mission Specs</h3>
          <p style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{room.job?.title || room.bounty?.title || 'Open Handshake'}</p>
          <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
            {room.job?.description || 'Collaborative discussion for specialized AI talent acquisition.'}
          </div>
        </div>

        <div className="glass-card-premium" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Status</h3>
          <div className="neuron-req" style={{ width: 'fit-content' }}>NEURAL LINK: ESTABLISHED</div>
          
          {user.id === room.company_id && room.status === 'active' && (
             <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Finalize the technical handshake to authorize the binding contract.</p>
                <button 
                  onClick={handleFinalize}
                  disabled={loading}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem', background: 'linear-gradient(45deg, var(--success), var(--primary-container))' }}
                >
                  {loading ? 'Executing...' : 'Execute Final Contract'}
                </button>
             </div>
          )}

          {room.status === 'executed' && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px', color: 'var(--success)', textAlign: 'center', fontWeight: 'bold' }}>
              CONTRACT SIGNED
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
