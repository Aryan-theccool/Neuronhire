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
