const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSEOMigration() {
  try {
    console.log('🚀 Starting SEO fields migration...')
    
    // Read the SQL migration file
    const fs = require('fs')
    const path = require('path')
    const sqlPath = path.join(__dirname, 'migrations', 'add_seo_fields_to_products.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📄 SQL Migration Content:')
    console.log(sql)
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('❌ Error executing migration:', error)
      console.log('\n📋 Please run this SQL manually in your Supabase SQL Editor:')
      console.log(sql)
      return
    }
    
    console.log('✅ SEO fields migration completed successfully!')
    console.log('📊 Migration result:', data)
    
    // Verify the migration by checking if the fields exist
    console.log('\n🔍 Verifying migration...')
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('seo_title, seo_description, seo_keywords, seo_tags')
      .limit(1)
    
    if (testError) {
      console.error('❌ Verification failed:', testError)
    } else {
      console.log('✅ Verification successful! SEO fields are available.')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n📋 Please run this SQL manually in your Supabase SQL Editor:')
    
    const fs = require('fs')
    const path = require('path')
    const sqlPath = path.join(__dirname, 'migrations', 'add_seo_fields_to_products.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log(sql)
  }
}

runSEOMigration()
