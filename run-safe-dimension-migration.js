const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSafeDimensionMigration() {
  try {
    console.log('Running safe migration: Add dimension images and editable headings...')

    // Read the safe migration file
    const migrationPath = path.join(__dirname, 'migrations', 'safe-add-dimension-images.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('Migration SQL:')
    console.log(migrationSQL)
    console.log('\nExecuting safe migration...')

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

    if (error) {
      console.error('Migration failed:', error)
      process.exit(1)
    }

    console.log('✅ Safe migration completed successfully!')
    console.log('New features added:')
    console.log('- Editable headings for dimension fields')
    console.log('- Product dimension images table')
    console.log('- Support for multiple dimension images')
    console.log('- Customizable field labels')
    console.log('\nThe migration handled existing tables gracefully.')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runSafeDimensionMigration()

