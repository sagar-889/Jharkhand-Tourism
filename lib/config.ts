// API Configuration
// This allows the frontend to connect to a separate backend deployment

export const API_CONFIG = {
  // Base URL for API calls
  // If NEXT_PUBLIC_API_URL is set, use it; otherwise use relative paths (same deployment)
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Timeout for API requests (in milliseconds)
  timeout: 30000,
  
  // Whether to use credentials (cookies) in requests
  withCredentials: true,
}

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., '/api/auth/login')
 * @returns Full URL or relative path
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if baseURL is set
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  if (API_CONFIG.baseURL) {
    // External backend - use full URL
    return `${API_CONFIG.baseURL}${cleanEndpoint}`
  }
  
  // Same deployment - use relative path
  return cleanEndpoint
}

/**
 * Create fetch options with default configuration
 * @param options - Additional fetch options
 * @returns Fetch options with defaults
 */
export function createFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    credentials: API_CONFIG.withCredentials ? 'include' : 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
}

// Export for easy access
export default API_CONFIG
