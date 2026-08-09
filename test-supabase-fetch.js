require('dotenv').config({ path: '.env.local' });

async function testLogin() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`;
  
  console.log('Attempting to login to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: 'admin@aaryaraakh.com',
        password: '0999#jay'
      })
    });
    const data = await res.json();
    console.log('Auth response:', JSON.stringify(data, null, 2));

    if (data.user) {
      console.log('Login success! Checking profile...');
      const profileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}`;
      const pres = await fetch(profileUrl, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      const pData = await pres.json();
      console.log('Profile response:', JSON.stringify(pData, null, 2));
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

testLogin();
