import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve('.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = Object.fromEntries(envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())))

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const anonClient = createClient(supabaseUrl, anonKey)
const serviceClient = createClient(supabaseUrl, serviceKey)

async function diagnostic() {
  console.log('--- DB DIAGNOSTIC ---')
  
  // 1. Check with Service Role (Bypass RLS)
  const { data: sJobs, error: sErr } = await serviceClient.from('job_postings').select('*')
  console.log(`[Service Role] Jobs count: ${sJobs?.length || 0}`)
  if (sErr) console.error('Service Role Error:', sErr)

  // 2. Check with Anon Client (Respect RLS)
  const { data: aJobs, error: aErr } = await anonClient.from('job_postings').select('*')
  console.log(`[Anon Client] Jobs count: ${aJobs?.length || 0}`)
  if (aErr) console.error('Anon Client Error:', aErr)

  // 3. Check for invalid foreign keys
  if (sJobs?.[0]) {
    const firstJob = sJobs[0]
    console.log(`\nAnalyzing Job ID: ${firstJob.id}`)
    console.log(`Company ID in Job: ${firstJob.company_id}`)
    const { data: comp } = await serviceClient.from('companies').select('*').eq('id', firstJob.company_id).single()
    console.log(`Matching Company Found: ${comp ? 'YES: ' + comp.company_name : 'NO'}`)
  }
}

diagnostic()
