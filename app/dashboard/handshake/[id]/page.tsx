import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { HandshakeTerminal } from '@/components/dashboard/HandshakeTerminal'

export default async function HandshakePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = params

  // 1. Get session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch room with related data
  const { data: room, error } = await supabase
    .from('handshake_rooms')
    .select('*, job:job_postings(*), bounty:bounties(*)')
    .eq('id', id)
    .single()

  if (error || !room) notFound()

  // 3. Security Check: Only the company or engineer involved can enter
  if (user.id !== room.company_id && user.id !== room.engineer_id) {
    redirect('/dashboard')
  }

  // 4. Fetch initial messages
  const { data: messages } = await supabase
    .from('handshake_messages')
    .select('*')
    .eq('room_id', id)
    .order('created_at', { ascending: true })

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="pulse-dot" /> Neural Handshake
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
          ID: {id.split('-')[0]} // Security Level: Alpha
        </p>
      </div>

      <HandshakeTerminal 
        roomId={id} 
        initialMessages={messages || []} 
        user={user} 
        room={room} 
      />
    </div>
  )
}
