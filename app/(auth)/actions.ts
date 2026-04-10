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
  
  let metaData: any = { role }

  if (role === 'engineer') {
    const full_name = formData.get('full_name') as string
    const location = formData.get('location') as string
    const primary_languages = (formData.get('primary_languages') as string)?.split(',').map(s => s.trim()) || []
    const frameworks = (formData.get('frameworks') as string)?.split(',').map(s => s.trim()) || []
    const domain_expertise = formData.getAll('domain_expertise') as string[]
    const skill_level = formData.get('skill_level') as string
    const work_type = formData.get('work_type') as string
    const hourly_rate = parseInt(formData.get('hourly_rate') as string) || 0
    const payout_id = formData.get('payout_id') as string

    metaData = {
      ...metaData,
      full_name,
      location,
      primary_languages,
      frameworks,
      domain_expertise,
      skill_level,
      work_preferences: { work_type, hourly_rate, is_remote: true },
      payout_info: { payout_id }
    }
  } else {
    // Company Metadata
    const company_name = formData.get('company_name') as string
    const industry = formData.get('industry') as string
    const ai_needs = formData.getAll('ai_needs') as string[]
    const budget_range = formData.get('budget_range') as string
    const min_experience = formData.get('min_experience') as string
    const payment_method = formData.get('payment_method') as string

    metaData = {
      ...metaData,
      company_name,
      industry,
      ai_readiness: {
        used_ai: formData.get('used_ai'),
        needs: ai_needs,
        budget_range
      },
      hiring_intent: {
        min_experience,
        payment_method
      }
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

  // Handle Initial Postings
  if (authData.user) {
    if (role === 'engineer') {
      const project_title = formData.get('project_title') as string
      if (project_title) {
        await supabase.from('projects').insert([{
          engineer_id: authData.user.id,
          title: project_title,
          problem: formData.get('project_problem'),
          approach: 'Initial case study',
          outcome: formData.get('project_outcome'),
          is_featured: true
        }])
      }
    } else {
      // Company Initial Job Post
      const problem_title = formData.get('problem_title') as string
      if (problem_title) {
        await supabase.from('jobs').insert([{
          company_id: authData.user.id,
          title: problem_title,
          description: formData.get('problem_description'),
          budget_inr: parseInt(formData.get('problem_budget') as string) || 0,
          location: 'Remote',
          type: 'Freelance', // Default during onboarding
          status: 'active'
        }])
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
