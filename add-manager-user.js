#!/usr/bin/env node

/**
 * Script to add a user to the managers table
 * This helps fix the authentication issue where user is signed in but not found in managers table
 */

console.log('🔧 Manager User Setup Script')
console.log('============================\n')

console.log('📋 Issue Identified:')
console.log('User "mabdulaharshad@gmail.com" is signed in but not found in managers table')
console.log('This causes the authentication system to get stuck on the login form\n')

console.log('🛠️  Solution:')
console.log('You need to add this user to the managers table in your Supabase database\n')

console.log('📝 SQL Commands to Run in Supabase SQL Editor:')
console.log('===============================================\n')

console.log('-- First, check if the user exists in auth.users')
console.log('SELECT id, email FROM auth.users WHERE email = \'mabdulaharshad@gmail.com\';\n')

console.log('-- If the user exists, get their ID and add them to managers table')
console.log('-- Replace USER_ID_HERE with the actual user ID from the query above')
console.log(`
INSERT INTO managers (id, email, full_name, role, is_active) 
VALUES (
  'USER_ID_HERE', 
  'mabdulaharshad@gmail.com',
  'Mabdulaharshad',
  'admin',  -- or 'manager' depending on what role you want
  true
) ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  updated_at = NOW();
`)

console.log('-- Alternative: If you want to create a new user in auth.users first')
console.log(`
-- This creates a new user in Supabase auth
-- You'll need to set a password for them
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  'mabdulaharshad@gmail.com',
  crypt('your_password_here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Mabdulaharshad"}',
  false,
  'authenticated',
  'authenticated'
);
`)

console.log('🔍 Steps to Fix:')
console.log('1. Go to your Supabase Dashboard')
console.log('2. Navigate to SQL Editor')
console.log('3. Run the first query to check if user exists')
console.log('4. If user exists, run the INSERT command with their actual ID')
console.log('5. If user doesn\'t exist, create them in auth.users first')
console.log('6. Then add them to managers table\n')

console.log('🎯 Expected Result:')
console.log('After adding the user to managers table:')
console.log('- User should be able to login as admin/manager')
console.log('- Authentication should work properly')
console.log('- User should be redirected to admin dashboard\n')

console.log('⚠️  Important Notes:')
console.log('- Make sure to use the correct user ID from auth.users')
console.log('- Set the appropriate role (admin or manager)')
console.log('- Ensure is_active is set to true')
console.log('- The user will need to login again after being added to managers table\n')

console.log('✨ After running these commands, the authentication should work properly!')
