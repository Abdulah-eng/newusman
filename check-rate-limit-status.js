require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkRateLimitStatus() {
  try {
    console.log('🔍 Checking Rate Limit Status...');
    console.log('Time:', new Date().toLocaleString());
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test with the admin account first (most likely to work)
    console.log('\nTesting admin account...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'mabdulaharshad@gmail.com',
      password: 'admin123'
    });
    
    if (authError) {
      if (authError.status === 429) {
        console.log('🚨 Rate limit still active');
        console.log('   Wait 5-10 more minutes before trying again');
        console.log('   All accounts are currently blocked');
      } else {
        console.log('❌ Other error:', authError.message);
      }
    } else {
      console.log('✅ Rate limit cleared!');
      console.log('✅ Admin account is working');
      console.log('✅ You can now login to the admin panel');
      
      // Sign out
      await supabase.auth.signOut();
      
      // Test a manager account
      console.log('\nTesting manager account...');
      const { data: managerData, error: managerError } = await supabase.auth.signInWithPassword({
        email: 'ayeshairfan.uaf.edu@gmail.com',
        password: 'manager123'
      });
      
      if (managerError) {
        if (managerError.status === 429) {
          console.log('⚠️  Admin works but manager still rate limited');
        } else {
          console.log('❌ Manager error:', managerError.message);
        }
      } else {
        console.log('✅ Manager account also working');
        await supabase.auth.signOut();
      }
    }
    
    console.log('\n📋 Status Summary:');
    console.log('  - If rate limited: Wait 5-10 more minutes');
    console.log('  - If working: You can login to admin panel');
    console.log('  - Run this script again to check status');
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkRateLimitStatus();
