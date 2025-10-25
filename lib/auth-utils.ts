/**
 * Authentication utilities for handling rate limits and retries
 */

export interface AuthResult {
  success: boolean
  error?: string
  data?: any
}

/**
 * Retry authentication with exponential backoff
 */
export async function retryAuth<T>(
  authFunction: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<AuthResult> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await authFunction()
      return { success: true, data: result }
    } catch (error: any) {
      // If it's a rate limit error and we have retries left
      if (error.status === 429 && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff
        console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // If it's not a rate limit error or we're out of retries
      return {
        success: false,
        error: error.status === 429 
          ? 'Too many login attempts. Please wait 5-10 minutes before trying again.'
          : error.message || 'Authentication failed'
      }
    }
  }
  
  return {
    success: false,
    error: 'Authentication failed after multiple attempts'
  }
}

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  return error?.status === 429 || error?.message?.includes('rate limit')
}

/**
 * Get user-friendly error message for authentication errors
 */
export function getAuthErrorMessage(error: any): string {
  if (error?.status === 429) {
    return 'Too many login attempts. Please wait 5-10 minutes before trying again.'
  }
  
  if (error?.status === 400) {
    return 'Invalid email or password'
  }
  
  if (error?.status === 401) {
    return 'Authentication failed'
  }
  
  if (error?.status === 403) {
    return 'Access denied'
  }
  
  return error?.message || 'Authentication failed'
}
