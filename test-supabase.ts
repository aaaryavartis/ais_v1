import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testLogin() {
  console.log('Attempting to login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@aaryaraakh.com',
    password: '0999#jay',
  });
  
  if (error) {
    console.error('Login error:', error.message);
  } else {
    console.log('Login success!', data.user.id);
    
    // check profile
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (pErr) console.error('Profile fetch error:', pErr.message);
    else console.log('Profile found:', profile);
  }
}

testLogin();
