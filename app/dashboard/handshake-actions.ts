'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Creates a handshake room and redirects to it.
 */
export async function createHandshakeRoom(invitationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Fetch invitation details
  const { data: invite, error: fetchErr } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', invitationId)
    .single()

  if (fetchErr) return { error: fetchErr.message }

  // 2. Check if room already exists
  const { data: existingRoom } = await supabase
    .from('handshake_rooms')
    .select('id')
    .match({
      company_id: invite.company_id,
      engineer_id: invite.engineer_id,
      job_id: invite.job_id,
      bounty_id: invite.bounty_id
    })
    .single()

  if (existingRoom) {
    redirect(`/dashboard/handshake/${existingRoom.id}`)
  }

  // 3. Create new room
  const { data: room, error: roomErr } = await supabase
    .from('handshake_rooms')
    .insert([{
      company_id: invite.company_id,
      engineer_id: invite.engineer_id,
      job_id: invite.job_id,
      bounty_id: invite.bounty_id,
      status: 'active'
    }])
    .select('id')
    .single()

  if (roomErr) return { error: roomErr.message }

  // 4. Send initial "System" message
  await supabase.from('handshake_messages').insert([{
    room_id: room.id,
    sender_id: user.id, // Or a reserved system ID if we had one
    content: "SYSTEM: Neural Link established. Collaboration space active."
  }])

  redirect(`/dashboard/handshake/${room.id}`)
}

/**
 * Persists a message to the handshake room.
 */
export async function sendHandshakeMessage(roomId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('handshake_messages').insert([{
    room_id: roomId,
    sender_id: user.id,
    content
  }])

  if (error) return { error: error.message }
  return { success: true }
}

/**
 * Executes the final contract, closing the handshake.
 */
export async function finalizeHire(roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Fetch room details
  const { data: room, error: roomErr } = await supabase
    .from('handshake_rooms')
    .select('*, job:job_postings(*), engineer:engineers(*)')
    .eq('id', roomId)
    .single()

  if (roomErr) return { error: roomErr.message }

  // 2. Check if user is the company
  if (user.id !== room.company_id) return { error: 'Only companies can finalize the hire.' }

  // 3. Create the real contract
  const contractData = {
    company_id: room.company_id,
    engineer_id: room.engineer_id,
    job_id: room.job_id,
    bounty_id: room.bounty_id,
    amount_inr: room.job?.budget_max_inr || 0, // Simplified for now
    status: 'active'
  }

  const { error: contractErr } = await supabase.from('contracts').insert([contractData])
  if (contractErr) return { error: contractErr.message }

  // 4. Close the room
  await supabase.from('handshake_rooms').update({ status: 'executed' }).eq('id', roomId)

  revalidatePath('/dashboard')
  return { success: true }
}
