const URL = 'https://iwebtnmssgwbxbitvhrl.supabase.co';
const ANON_KEY = 'sb_publishable_3OEdYfHL9EXf3ajTX2cKdQ_eCUq3WyW';

async function runDiag() {
  console.log('=== Supabase Diagnostics ===');
  
  const headers = {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`
  };

  // 1. Fetch courses
  console.log('\n--- Fetching Courses ---');
  try {
    const res = await fetch(`${URL}/rest/v1/courses?select=*&limit=3`, { headers });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching courses:', err.message);
  }

  // 2. Count courses
  console.log('\n--- Counting Courses ---');
  try {
    const res = await fetch(`${URL}/rest/v1/courses?select=count`, { 
      headers: { ...headers, 'Prefer': 'count=exact' } 
    });
    console.log('Status:', res.status);
    console.log('Count Header:', res.headers.get('content-range'));
  } catch (err) {
    console.error('Error counting courses:', err.message);
  }

  // 3. List tables (PostgREST root)
  console.log('\n--- List Tables (OpenAPI) ---');
  try {
    const res = await fetch(`${URL}/rest/v1/`, { headers });
    const data = await res.json();
    console.log('Definitions found:', Object.keys(data.definitions || {}).join(', '));
  } catch (err) {
    console.error('Error listing tables:', err.message);
  }
}

runDiag();
