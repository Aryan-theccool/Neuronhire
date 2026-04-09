import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve('.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = Object.fromEntries(envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())))

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugProfiles() {
  console.log('--- Checking All Users (Auth) ---')
  const { data: { users }, error: uError } = await supabase.auth.admin.listUsers()
  if (uError) console.log('Auth Error:', uError)
  else {
    console.log(`Auth Users Count: ${users.length}`)
    users.forEach(u => console.log(`- ${u.email} (${u.id}) Role: ${u.user_metadata?.role}`))
  }

  console.log('\n--- Checking Companies Table ---')
  const { data: companies } = await supabase.from('companies').select('*')
  console.log('Companies count:', companies?.length || 0)
  companies?.forEach(c => console.log(`- ${c.company_name} (ID: ${c.id})`))

  console.log('\n--- Checking Engineers Table ---')
  const { data: engineers } = await supabase.from('engineers').select('*')
  console.log('Engineers count:', engineers?.length || 0)
  engineers?.forEach(e => console.log(`- ${e.full_name} (ID: ${e.id})`))
}

debugProfiles()
