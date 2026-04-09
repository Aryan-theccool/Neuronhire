'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function acceptProposal(proposalId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // 1. Fetch proposal and check if current user is the company owner
  const { data: proposal, error: pError } = await supabase
    .from('proposals')
    .select('*, job:job_postings!inner(company_id)')
    .eq('id', proposalId)
    .single()

  if (pError || !proposal) return { error: 'Proposal not found' }
  if (proposal.job.company_id !== user.id) return { error: 'Only the job owner can accept proposals' }

  // 2. Update proposal status
  const { error: updateError } = await supabase
    .from('proposals')
    .update({ status: 'accepted' })
    .eq('id', proposalId)

  if (updateError) return { error: updateError.message }

  // 3. Create a contract record
  const { error: contractError } = await supabase
    .from('contracts')
    .insert({
      job_id: proposal.job_id,
      engineer_id: proposal.engineer_id,
      company_id: user.id,
      total_inr: proposal.proposed_rate_inr || 0,
      status: 'active',
      started_at: new Date().toISOString()
    })

  if (contractError) {
      console.error('Contract creation error:', contractError)
      // We don't necessarily roll back the proposal update in this MVP, but we log the error
  }

  // 4. Update job status to in_progress
  await supabase.from('job_postings').update({ status: 'in_progress' }).eq('id', proposal.job_id)

  revalidatePath('/dashboard')
  revalidatePath(`/jobs/${proposal.job_id}`)
  return { success: true }
}
