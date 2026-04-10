'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Step 1: Basic & Auth
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const full_name = formData.get('full_name') as string
  const location = formData.get('location') as string

  // Step 2: Capability
  const primary_languages = (formData.get('primary_languages') as string)?.split(',').map(s => s.trim()) || []
  const frameworks = (formData.get('frameworks') as string)?.split(',').map(s => s.trim()) || []
  const domain_expertise = formData.getAll('domain_expertise') as string[]
  const skill_level = formData.get('skill_level') as string

  // Step 3: Proof of Work
  const project_title = formData.get('project_title') as string
  const project_problem = formData.get('project_problem') as string
  const project_outcome = formData.get('project_outcome') as string
  const project_url = formData.get('project_url') as string

  // Step 4: Preferences
  const work_type = formData.get('work_type') as string
  const hourly_rate = parseInt(formData.get('hourly_rate') as string) || 0
  const payout_id = formData.get('payout_id') as string

  const metaData = {
    role,
    full_name,
    location,
    primary_languages,
    frameworks,
    domain_expertise,
    skill_level,
    work_preferences: {
      work_type,
      hourly_rate,
      is_remote: true
    },
    payout_info: {
      payout_id
    }
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metaData
    }
  })

  if (error) {
    redirect('/signup?message=' + encodeURIComponent(error.message))
  }

  // If engineer, insert the initial project
  if (role === 'engineer' && authData.user && project_title) {
    await supabase.from('projects').insert([{
      engineer_id: authData.user.id,
      title: project_title,
      problem: project_problem,
      approach: 'Initial case study during onboarding',
      outcome: project_outcome,
      github_url: project_url,
      is_featured: true
    }])
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
