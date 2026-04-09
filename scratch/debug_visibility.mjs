import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env.local
const envPath = path.resolve('.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = Object.fromEntries(envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())))

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugPolicies() {
  console.log('--- Checking RLS Policies ---')
  const { data: policies, error } = await supabase.rpc('get_policies') // This RPC might not exist, trying direct query if possible
  
  // Alternative: Check if we can see data as Service Role
  console.log('\n--- Checking Job Postings (Service Role) ---')
  const { data: jobs, error: jError } = await supabase.from('job_postings').select('*')
  console.log('Jobs Found:', jobs?.length || 0)
  if (jobs?.length > 0) {
    console.log('Last Job:', jobs[jobs.length - 1])
  }
}

debugPolicies()
