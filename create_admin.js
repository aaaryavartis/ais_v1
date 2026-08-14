require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = 'careers@aaryavartservices.com';

async function updateRole() {
  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      role: 'admin'
    })
  });
  
  const data = await res.json();
  console.log("Update response:", data);
}

updateRole();
