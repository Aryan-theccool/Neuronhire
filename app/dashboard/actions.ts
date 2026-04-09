'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJobPosting(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Parse fields
  const skillsString = formData.get('skills_required') as string;
  const skills_required = skillsString ? skillsString.split(',').map(s => s.trim()) : [];

  const jobData = {
    company_id: user.id, // Assuming the RLS ensures this matches companies table
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

  const { error } = await supabase.from('job_postings').insert([jobData])

  if (error) {
    console.error('Job Posting Error:', error)
    return { error: error.message }
  }

  revalidatePath('/jobs')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function createBounty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

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

  const { error } = await supabase.from('bounties').insert([bountyData])

  if (error) return { error: error.message }

  revalidatePath('/bounties')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function publishProduct(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

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

  const { error } = await supabase.from('marketplace_products').insert([productData])

  if (error) return { error: error.message }

  revalidatePath('/marketplace')
  revalidatePath('/dashboard')
  return { success: true }
}
