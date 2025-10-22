import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Create admin client with service role key for admin operations
let supabaseAdmin
try {
  supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
} catch (error) {
  console.error('Failed to create Supabase admin client:', error)
  supabaseAdmin = null
}

// GET /api/manager/accounts - Get all manager accounts
export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get current user from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Special bypass for mabdulaharshad@gmail.com
    if (user.email === 'mabdulaharshad@gmail.com') {
      console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com in API')
      // Allow access without checking managers table
    } else {
      // Check if user is admin in managers table
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (managerError || !manager || manager.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    // Get all managers
    const { data: managers, error } = await supabase
      .from('managers')
      .select('id, email, full_name, role, is_active, created_at, last_login, created_by')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching managers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch managers' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      managers: managers || []
    })

  } catch (error) {
    console.error('Get managers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/manager/accounts - Create new manager account
export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get current user from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Special bypass for mabdulaharshad@gmail.com
    let currentManager
    if (user.email === 'mabdulaharshad@gmail.com') {
      console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com in POST API')
      // Create a virtual manager object for bypass user
      currentManager = {
        id: user.id,
        role: 'admin'
      }
    } else {
      // Check if user is admin in managers table
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('id, role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (managerError || !manager || manager.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
      currentManager = manager
    }

    const { email, password, fullName, role = 'manager' } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!['admin', 'manager'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or manager' },
        { status: 400 }
      )
    }

    // Check if email already exists in managers table
    const { data: existingManager } = await supabase
      .from('managers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingManager) {
      return NextResponse.json(
        { error: 'Email already exists in managers' },
        { status: 400 }
      )
    }

    // Also check if email exists in auth users (additional safety check)
    try {
      const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      const emailExists = existingAuthUser?.users?.some(user => 
        user.email?.toLowerCase() === email.toLowerCase()
      )
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists in the system' },
          { status: 400 }
        )
      }
    } catch (listError) {
      console.log('Could not check existing auth users, proceeding with creation')
    }

    // Create user in Supabase auth using admin client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      
      // Handle specific auth errors
      if (authError.message.includes('already been registered') || authError.message.includes('email_exists')) {
        return NextResponse.json(
          { 
            error: 'Email already exists in the system',
            details: 'This email address is already registered. Please use a different email.'
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create user account',
          details: authError.message 
        },
        { status: 500 }
      )
    }

    // Create manager record
    const { data: newManager, error: createError } = await supabase
      .from('managers')
      .insert({
        id: authUser.user.id,
        email: email.toLowerCase(),
        full_name: fullName,
        role,
        is_active: true,
        created_by: currentManager.id
      })
      .select('id, email, full_name, role, is_active, created_at')
      .single()

    if (createError) {
      console.error('Error creating manager:', createError)
      // Clean up auth user if manager creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
        console.log('Cleaned up auth user after manager creation failure')
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }
      return NextResponse.json(
        { 
          error: 'Failed to create manager account',
          details: createError.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      manager: newManager,
      message: 'Manager account created successfully'
    })

  } catch (error) {
    console.error('Create manager error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/manager/accounts - Delete manager account
export async function DELETE(request: NextRequest) {
  try {
    // Check if required environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get current user from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Special bypass for mabdulaharshad@gmail.com
    let currentManager
    if (user.email === 'mabdulaharshad@gmail.com') {
      console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com in DELETE API')
      // Create a virtual manager object for bypass user
      currentManager = {
        id: user.id,
        role: 'admin'
      }
    } else {
      // Check if user is admin in managers table
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('id, role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (managerError || !manager || manager.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
      currentManager = manager
    }

    const { searchParams } = new URL(request.url)
    const managerId = searchParams.get('id')

    if (!managerId) {
      return NextResponse.json(
        { error: 'Manager ID is required' },
        { status: 400 }
      )
    }

    // Prevent deleting own account
    if (currentManager.id === managerId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete from Supabase auth using admin client
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(managerId)
    
    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError)
      return NextResponse.json(
        { 
          error: 'Failed to delete user account',
          details: authDeleteError.message 
        },
        { status: 500 }
      )
    }

    // Delete manager record
    const { error: deleteError } = await supabase
      .from('managers')
      .delete()
      .eq('id', managerId)

    if (deleteError) {
      console.error('Error deleting manager:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete manager account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Manager account deleted successfully'
    })

  } catch (error) {
    console.error('Delete manager error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
