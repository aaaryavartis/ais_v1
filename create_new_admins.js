require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: fetch
  },
  realtime: {
    transport: WebSocket
  }
});

async function createAdmins() {
  const newAdmins = [
    { email: 'admin1@aaryavartservices.com', password: 'AdminPass!123' },
    { email: 'admin2@aaryavartservices.com', password: 'AdminPass!123' }
  ];

  for (const admin of newAdmins) {
    console.log(`Creating user: ${admin.email}`);
    
    // Create the user
    const { data: userAuth, error: authError } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true
    });

    if (authError) {
      console.error(`Error creating user ${admin.email}:`, authError.message);
      continue;
    }

    console.log(`User created. Updating role in profiles...`);

    // Give the database trigger a second to run and insert the profile
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update the profile to set the role to 'admin'
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', admin.email);

    if (profileError) {
      console.error(`Error updating role for ${admin.email}:`, profileError.message);
    } else {
      console.log(`Successfully made ${admin.email} an admin!`);
    }
  }
}

createAdmins();
