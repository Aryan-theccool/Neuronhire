import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Read env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim().replace(/^"(.*)"$/, '$1')]
    })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function seed() {
  console.log('--- STARTING COMPREHENSIVE SEED ---')

  // 1. Create a dummy Profile/User ID for the company
  // We can't easily create an Auth user via Service Role without knowing the exact schema expectations, 
  // but we can try to find an existing user or create a row in companies with a random uuid if the DB allows it.
  // Usually company_id in job_postings/bounties refers to the user id (company role).
  
  const dummyUserId = '00000000-0000-0000-0000-000000000000' // Use a static dummy if allowed

  console.log('Ensuring dummy company exists...')
  const { data: existingCompany } = await supabase.from('companies').select('id').eq('id', dummyUserId).single()

  if (!existingCompany) {
    const { error: cErr } = await supabase.from('companies').insert({
      id: dummyUserId,
      company_name: 'NeuroCore AI Labs',
      industry: 'Artificial General Intelligence',
      size: '50-200',
      website: 'https://neurocore.ai',
      bio: 'Leading the frontier of real-time multi-modal AI systems.'
    })
    if (cErr) {
        console.log('Inserting company failed, trying to find any user...')
        const { data: users } = await supabase.from('profiles').select('id').limit(1)
        if (users && users.length > 0) {
            console.log('Found user:', users[0].id)
            // Ensure company exists for this user
            const { error: c2Err } = await supabase.from('companies').upsert({
                id: users[0].id,
                company_name: 'Nexus AI Solutions',
                industry: 'Cloud AI',
                size: '10-50'
            })
            if (c2Err) console.error('Upsert failed:', c2Err)
        } else {
            console.error('CRITICAL: No users in DB. User must sign up at least once.')
            return
        }
    }
  }

  const { data: company } = await supabase.from('companies').select('id').limit(1).single()
  const companyId = company.id
  console.log(`Using Company ID: ${companyId}`)

  // 2. Insert Premium Bounties
  const bounties = [
    {
      company_id: companyId,
      title: 'Optimizing Llama-3 for Edge Devices',
      problem_description: 'We need to shrink Llama-3 8B to under 2GB VRAM while maintaining 90% accuracy on MMLU. Focus on specialized quantization techniques like GGUF or AWQ improvements.',
      expected_output: 'Quantization script and benchmark report.',
      reward_inr: 85000,
      skills_needed: ['PyTorch', 'C++', 'Quantization', 'LLMs'],
      status: 'open',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      company_id: companyId,
      title: 'Real-time Audio Latency Fix',
      problem_description: 'Our conversational AI has a jitter issue in WebSocket audio streams. We need a jitter-buffer implementation that keeps latency < 150ms.',
      expected_output: 'Rust or Node.js implementation of the buffer logic.',
      reward_inr: 45000,
      skills_needed: ['WebRTC', 'Rust', 'WebSockets'],
      status: 'open',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  console.log('Inserting bounties...')
  await supabase.from('bounties').insert(bounties)

  // 3. Insert Premium Jobs
  const jobs = [
    {
      company_id: companyId,
      title: 'Senior AI Research Engineer',
      description: 'Join our Core AI Team to develop next-generation multi-modal agents. You will be responsible for scaling our training infrastructure using Slurm and Kubernetes.',
      engagement_type: 'full-time',
      budget_min_inr: 250000,
      budget_max_inr: 450000,
      min_neuron_score: 85,
      skills_required: ['CUDA', 'PyTorch', 'Distributed Training'],
      is_active: true
    },
    {
      company_id: companyId,
      title: 'Fullstack AI Product Engineer',
      description: 'Help us build the most intuitive interface for AI model orchestration. Bridging the gap between complex Python backends and sleek React frontends.',
      engagement_type: 'contract',
      budget_min_inr: 150000,
      budget_max_inr: 300000,
      min_neuron_score: 70,
      skills_required: ['Next.js', 'FastAPI', 'LangChain'],
      is_active: true
    }
  ]

  console.log('Inserting jobs...')
  await supabase.from('job_postings').insert(jobs)

  console.log('--- SEEDING COMPLETE ---')
}

seed()
