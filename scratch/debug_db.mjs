import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugJobs() {
  console.log('--- Checking Job Postings ---')
  const { data: jobs, error: jError } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false }).limit(5)
  if (jError) console.error('Job Error:', jError)
  else console.log('Jobs Found:', jobs)

  console.log('\n--- Checking Companies ---')
  const { data: companies, error: cError } = await supabase.from('companies').select('*').limit(5)
  if (cError) console.error('Company Error:', cError)
  else console.log('Companies Found:', companies)
}

debugJobs()
