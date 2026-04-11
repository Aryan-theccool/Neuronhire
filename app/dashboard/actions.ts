'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Ensures that a profile entry exists in the appropriate table (companies or engineers).
 * This is a "self-healing" measure for users who signed up but don't have a DB row yet.
 */
export async function ensureProfileExists(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const role = user.user_metadata?.role || 'engineer'
  const email = user.email || ''

  if (role === 'company') {
    const { data: profile } = await supabase.from('companies').select('id').eq('id', user.id).single()
    if (!profile) {
      console.log(`Initializing company profile for ${user.id}`)
      await supabase.from('companies').insert([{
        id: user.id,
        company_name: email.split('@')[0],
        size: '1-10',
        ai_readiness_score: 50
      }])
    }
  } else {
    const { data: profile } = await supabase.from('engineers').select('id').eq('id', user.id).single()
    if (!profile) {
      console.log(`Initializing engineer profile for ${user.id}`)
      await supabase.from('engineers').insert([{
        id: user.id,
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000),
        full_name: email.split('@')[0],
        neuron_score: 0,
        is_available: true
      }])
    }
  }

  revalidatePath('/dashboard')
}

export async function createJobPosting(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure profile exists to avoid foreign key violations
  await ensureProfileExists(formData)

  // Parse fields
  const skillsString = formData.get('skills_required') as string;
  const skills_required = skillsString ? skillsString.split(',').map(s => s.trim()) : [];

  const jobData = {
    company_id: user.id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    engagement_type: formData.get('engagement_type') as string,
    skills_required,
    budget_min_inr: parseInt(formData.get('budget_min_inr') as string) || null,
    budget_max_inr: parseInt(formData.get('budget_max_inr') as string) || null,
    min_neuron_score: parseInt(formData.get('min_neuron_score') as string) || 0,
    duration: formData.get('duration') as string || null,
    status: 'open'
  }

  const { data, error } = await supabase.from('job_postings').insert([jobData]).select('id').single()

  if (error) {
    console.error('Job Posting Error:', error)
    return { error: error.message }
  }

  revalidatePath('/jobs')
  revalidatePath('/dashboard')
  return { success: true, id: data.id }
}

export async function createBounty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  await ensureProfileExists(formData)

  const skillsString = formData.get('skills_needed') as string;
  const skills_needed = skillsString ? skillsString.split(',').map(s => s.trim()) : [];

  const bountyData = {
    company_id: user.id,
    title: formData.get('title') as string,
    problem_description: formData.get('problem_description') as string,
    expected_output: formData.get('expected_output') as string || null,
    reward_inr: parseInt(formData.get('reward_inr') as string) || 0,
    skills_needed,
    status: 'open'
  }

  const { data, error } = await supabase.from('bounties').insert([bountyData]).select('id').single()

  if (error) return { error: error.message }

  revalidatePath('/bounties')
  revalidatePath('/dashboard')
  return { success: true, id: data.id }
}

export async function publishProduct(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  await ensureProfileExists(formData)

  const techString = formData.get('tech_stack') as string;
  const tech_stack = techString ? techString.split(',').map(s => s.trim()) : [];

  const productData = {
    engineer_id: user.id,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    pricing_model: formData.get('pricing_model') as string,
    price_inr: parseInt(formData.get('price_inr') as string) || 0,
    demo_url: formData.get('demo_url') as string || null,
    tech_stack,
    status: 'active'
  }

  const { data, error } = await supabase.from('marketplace_products').insert([productData]).select('id').single()

  if (error) return { error: error.message }

  revalidatePath('/marketplace')
  revalidatePath('/dashboard')
  return { success: true, id: data.id }
}

/**
 * Persists an invitation sent from the Matching Engine.
 */
export async function sendInvitation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const invitationData = {
    company_id: user.id,
    engineer_id: formData.get('engineer_id') as string,
    job_id: formData.get('job_id') as string || null,
    bounty_id: formData.get('bounty_id') as string || null,
    message: formData.get('message') as string || 'We think you are a great fit for our AI mission!',
    status: 'pending'
  }

  const { error } = await supabase.from('invitations').insert([invitationData])
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Fetches invitations for the current engineer.
 */
export async function getEngineerInvitations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('invitations')
    .select('*, company:companies(company_name, industry), job:job_postings(title), bounty:bounties(title)')
    .eq('engineer_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch Invitations Error:', error)
    return []
  }
  return data || []
}

/**
 * Handles Engineer's response to an offer.
 */
export async function respondToInvitation(invitationId: string, status: 'accepted' | 'declined') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Update invitation status
  const { data: invite, error: updateError } = await supabase
    .from('invitations')
    .update({ status })
    .eq('id', invitationId)
    .eq('engineer_id', user.id)
    .select('*, job_id, bounty_id, company_id')
    .single()

  if (updateError) return { error: updateError.message }

  // 2. If 'B' (Final Handshake) - Create a formal proposal
  if (status === 'accepted') {
    const proposalData = {
      job_id: invite.job_id,
      bounty_id: invite.bounty_id,
      engineer_id: user.id,
      cover_letter: `Acceptance of Invitation: ${invite.message}`,
      status: 'accepted', // This means "Talent has accepted the invite, Company must final hire"
      match_origin: 'matching_engine'
    }

    const { error: propError } = await supabase.from('proposals').insert([proposalData])
    if (propError) console.error('Proposal creation error:', propError)
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * MATCHING ENGINE: Precision Talent Discovery
 * Fetches and ranks engineers based on a company's active requirements.
 */
export async function getPrecisionMatches(companyId: string) {
  const supabase = await createClient()

  // 1. Fetch company's active requirements (Job Postings & Bounties)
  const [{ data: jobs }, { data: bounties }] = await Promise.all([
    supabase.from('job_postings').select('skills_required').eq('company_id', companyId).eq('status', 'open'),
    supabase.from('bounties').select('skills_needed').eq('company_id', companyId).eq('status', 'open')
  ])

  // 2. Aggregate all unique required skills
  const allRequiredSkills = new Set<string>()
  jobs?.forEach(j => j.skills_required?.forEach((s: string) => allRequiredSkills.add(s.toLowerCase())))
  bounties?.forEach(b => b.skills_needed?.forEach((s: string) => allRequiredSkills.add(s.toLowerCase())))
  
  const skillArray = Array.from(allRequiredSkills)

  if (skillArray.length === 0) return []

  // 3. Query engineers who have AT LEAST ONE matching skill OR high NeuronScore
  // Using .overlaps('ai_stack', skillArray) for efficient matching
  const { data: engineers, error } = await supabase
    .from('engineers')
    .select('*')
    .eq('is_available', true)
    .or(`ai_stack.overlaps.{${skillArray.join(',')}},neuron_score.gt.85`)
    .order('neuron_score', { ascending: false })
    .limit(30)

  if (error) {
    console.error('Matching Error:', error)
    return []
  }

  // 4. Rank by our Hybrid Heuristic
  const rankedMatches = (engineers || []).map(engineer => {
    const engineerStack = (engineer.ai_stack || []).map((s: string) => s.toLowerCase())
    const matchedSkills = skillArray.filter(s => engineerStack.includes(s))
    
    // Weighted Heuristic: 60% Skill overlap, 40% NeuronScore
    const skillScore = skillArray.length > 0 ? (matchedSkills.length / skillArray.length) * 60 : 0
    const neuronWeight = (engineer.neuron_score / 100) * 40
    const totalMatchScore = Math.min(Math.round(skillScore + neuronWeight), 100)

    // Generate reasoning text
    let reasoning = ''
    if (matchedSkills.length > 0) {
      reasoning = `Matches your focus on: ${matchedSkills.slice(0, 3).join(', ')}`
    } else {
      reasoning = 'Elite performance score in related AI disciplines.'
    }

    return {
      ...engineer,
      match_score: totalMatchScore,
      matched_skills: matchedSkills,
      reasoning
    }
  })

  // Sort by final match score
  return rankedMatches.sort((a, b) => b.match_score - a.match_score)
}
