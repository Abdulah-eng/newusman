-- Create managers table for admin panel user management
-- This table links to Supabase auth users
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES managers(id),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_managers_email ON managers(email);
CREATE INDEX IF NOT EXISTS idx_managers_role ON managers(role);
CREATE INDEX IF NOT EXISTS idx_managers_is_active ON managers(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_managers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_managers_updated_at 
  BEFORE UPDATE ON managers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_managers_updated_at();

-- Note: RLS is disabled - we handle permissions in the application layer
-- This avoids complex RLS policy syntax issues

-- Note: You'll need to create the admin user in Supabase Auth first
-- Then manually insert the manager record with the auth user's ID
-- 
-- To create admin user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" 
-- 3. Email: admin@bedora.com
-- 4. Password: admin123
-- 5. Copy the user ID and use it in the INSERT below
--
-- INSERT INTO managers (id, email, full_name, role, is_active) 
-- VALUES (
--   'USER_ID_FROM_SUPABASE_AUTH', 
--   'admin@bedora.com',
--   'System Administrator',
--   'admin',
--   true
-- ) ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON managers TO authenticated;
GRANT ALL ON managers TO anon;
