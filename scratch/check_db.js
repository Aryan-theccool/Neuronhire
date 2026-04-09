require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkData() {
    const { data: companies, error: ce } = await supabase.from('companies').select('id, company_name');
    console.log('Companies:', companies);
    
    const { data: bounties, error: be } = await supabase.from('bounties').select('id, title');
    console.log('Bounties:', bounties);
    
    const { data: jobs, error: je } = await supabase.from('job_postings').select('id, title');
    console.log('Jobs:', jobs);
}

checkData();
