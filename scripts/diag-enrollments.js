const URL = 'https://iwebtnmssgwbxbitvhrl.supabase.co';
const ANON_KEY = 'sb_publishable_3OEdYfHL9EXf3ajTX2cKdQ_eCUq3WyW';

async function runDiag() {
  console.log('=== Enrollments Diagnostics ===');
  
  const headers = {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`
  };

  try {
    const res = await fetch(`${URL}/rest/v1/enrollments?select=*&limit=1`, { headers });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching enrollments:', err.message);
  }
}

runDiag();
