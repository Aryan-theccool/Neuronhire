'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateEngineerProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const aiStackString = formData.get('ai_stack') as string
  const ai_stack = aiStackString ? aiStackString.split(',').map(s => s.trim()) : []

  const updateData = {
    bio: formData.get('bio') as string,
    location: formData.get('location') as string,
    ai_philosophy: formData.get('ai_philosophy') as string,
    hourly_rate_inr: parseInt(formData.get('hourly_rate_inr') as string) || null,
    github_url: formData.get('github_url') as string || null,
    linkedin_url: formData.get('linkedin_url') as string || null,
    website_url: formData.get('website_url') as string || null,
    ai_stack
  }

  const { error } = await supabase
    .from('engineers')
    .update(updateData)
    .eq('id', user.id)

  if (error) return { error: error.message }

  // Recalculate score after profile update
  // Note: We might want to trigger this via the API or directly here
  
  revalidatePath('/dashboard')
  revalidatePath(`/engineer/${user.user_metadata.username}`)
  return { success: true }
}

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const techString = formData.get('tech_stack') as string
  const tech_stack = techString ? techString.split(',').map(s => s.trim()) : []

  const projectData = {
    engineer_id: user.id,
    title: formData.get('title') as string,
    problem: formData.get('problem') as string,
    approach: formData.get('approach') as string,
    outcome: formData.get('outcome') as string,
    tech_stack,
    demo_url: formData.get('demo_url') as string || null,
    github_url: formData.get('github_url') as string || null,
    is_featured: formData.get('is_featured') === 'true'
  }

  const { error } = await supabase
    .from('projects')
    .insert([projectData])

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath(`/engineer/${user.user_metadata.username}`)
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('engineer_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath(`/engineer/${user.user_metadata.username}`)
  return { success: true }
}
