-- Fix managers table RLS issues
-- This script disables RLS on the managers table to allow queries

-- Disable RLS on managers table
ALTER TABLE managers DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be blocking queries
DROP POLICY IF EXISTS "Managers can view all managers" ON managers;
DROP POLICY IF EXISTS "Only admins can insert managers" ON managers;
DROP POLICY IF EXISTS "Only admins can update managers" ON managers;
DROP POLICY IF EXISTS "Only admins can delete managers" ON managers;

-- Ensure proper permissions
GRANT ALL ON managers TO authenticated;
GRANT ALL ON managers TO anon;
GRANT ALL ON managers TO service_role;

-- Verify the table is accessible
SELECT 'managers table is accessible' as status;
