'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function applyToJob(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const jobId = formData.get('jobId') as string
  const coverNote = formData.get('coverNote') as string
  const proposedRate = formData.get('proposedRate') ? Number(formData.get('proposedRate')) : null

  // Verify the user is an engineer
  const { data: engineer } = await supabase
    .from('engineers')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!engineer) throw new Error('Only engineers can apply to jobs.')

  const { error } = await supabase
    .from('proposals')
    .insert({
      job_id: jobId,
      engineer_id: user.id,
      cover_note: coverNote,
      proposed_rate_inr: proposedRate,
      status: 'pending'
    })

  if (error) {
    console.error('Apply error:', error)
    return { error: error.message }
  }

  revalidatePath(`/jobs/${jobId}`)
  return { success: true }
}

export async function submitBounty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const bountyId = formData.get('bountyId') as string
  const solutionDescription = formData.get('solutionDescription') as string
  const githubUrl = formData.get('githubUrl') as string
  const demoUrl = formData.get('demoUrl') as string

  // Verify engineer
  const { data: engineer } = await supabase
    .from('engineers')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!engineer) throw new Error('Only engineers can submit bounties.')

  const { error } = await supabase
    .from('bounty_submissions')
    .insert({
      bounty_id: bountyId,
      engineer_id: user.id,
      solution_description: solutionDescription,
      github_url: githubUrl,
      demo_url: demoUrl,
      status: 'pending'
    })

  if (error) {
    console.error('Bounty submission error:', error)
    return { error: error.message }
  }

  revalidatePath(`/bounties/${bountyId}`)
  return { success: true }
}
