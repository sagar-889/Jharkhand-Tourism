import { useState, useCallback } from 'react'
import { getApiUrl, createFetchOptions } from '../config'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Custom hook for making API calls with automatic backend URL handling
 * Supports both same-deployment and separate backend configurations
 */
export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const request = useCallback(
    async (endpoint: string, fetchOptions: RequestInit = {}) => {
      setState({ data: null, loading: true, error: null })

      try {
        const url = getApiUrl(endpoint)
        const response = await fetch(url, createFetchOptions(fetchOptions))

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setState({ data, loading: false, error: null })
        
        if (options.onSuccess) {
          options.onSuccess(data)
        }

        return data
      } catch (error) {
        const err = error instanceof Error ? error : new Error('An unknown error occurred')
        setState({ data: null, loading: false, error: err })
        
        if (options.onError) {
          options.onError(err)
        }

        throw err
      }
    },
    [options]
  )

  const get = useCallback(
    (endpoint: string, options: RequestInit = {}) => {
      return request(endpoint, { ...options, method: 'GET' })
    },
    [request]
  )

  const post = useCallback(
    (endpoint: string, body: any, options: RequestInit = {}) => {
      return request(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      })
    },
    [request]
  )

  const put = useCallback(
    (endpoint: string, body: any, options: RequestInit = {}) => {
      return request(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
      })
    },
    [request]
  )

  const del = useCallback(
    (endpoint: string, options: RequestInit = {}) => {
      return request(endpoint, { ...options, method: 'DELETE' })
    },
    [request]
  )

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del,
  }
}

export default useApi
