# API Usage Examples

This document shows how to use the new backend configuration in your components.

---

## Method 1: Using the `useApi` Hook (Recommended)

### Basic Example
```typescript
'use client'
import { useApi } from '@/lib/hooks/useApi'

export default function LoginForm() {
  const { post, loading, error } = useApi()

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await post('/api/auth/login', { email, password })
      console.log('Login successful:', data)
      // Handle success (e.g., redirect, store token)
    } catch (err) {
      console.error('Login failed:', err)
      // Error is already in the error state
    }
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <button onClick={() => handleLogin('user@example.com', 'password')}>
        Login
      </button>
    </div>
  )
}
```

### With Callbacks
```typescript
const { post } = useApi({
  onSuccess: (data) => {
    console.log('Success!', data)
    router.push('/dashboard')
  },
  onError: (error) => {
    console.error('Failed:', error)
    toast.error(error.message)
  }
})

await post('/api/auth/login', { email, password })
```

### GET Request
```typescript
const { get, data, loading } = useApi()

useEffect(() => {
  get('/api/places')
}, [])

if (loading) return <Spinner />
return <PlacesList places={data} />
```

### PUT Request
```typescript
const { put } = useApi()

const updateProfile = async (userId: string, updates: any) => {
  await put(`/api/users/${userId}`, updates)
}
```

### DELETE Request
```typescript
const { delete: deleteItem } = useApi()

const removePlace = async (placeId: string) => {
  await deleteItem(`/api/places/${placeId}`)
}
```

---

## Method 2: Using Helper Functions

### Basic Fetch
```typescript
import { getApiUrl, createFetchOptions } from '@/lib/config'

const response = await fetch(
  getApiUrl('/api/auth/login'),
  createFetchOptions({
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
)

const data = await response.json()
```

### With Custom Headers
```typescript
const token = localStorage.getItem('token')

const response = await fetch(
  getApiUrl('/api/protected-route'),
  createFetchOptions({
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
)
```

### File Upload
```typescript
const formData = new FormData()
formData.append('file', file)

const response = await fetch(
  getApiUrl('/api/upload'),
  {
    method: 'POST',
    body: formData,
    credentials: 'include',
    // Don't set Content-Type for FormData - browser sets it automatically
  }
)
```

---

## Method 3: Direct Configuration Import

### Check Current Backend
```typescript
import API_CONFIG from '@/lib/config'

console.log('Backend URL:', API_CONFIG.baseURL || 'Same deployment')
console.log('Timeout:', API_CONFIG.timeout)
```

### Conditional Logic
```typescript
import API_CONFIG from '@/lib/config'

if (API_CONFIG.baseURL) {
  console.log('Using external backend:', API_CONFIG.baseURL)
} else {
  console.log('Using same deployment (relative paths)')
}
```

---

## Real-World Examples

### Authentication Flow
```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { post, loading, error } = useApi({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await post('/api/auth/login', { email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      {error && <p className="error">{error.message}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Fetching Data with Loading State
```typescript
'use client'
import { useEffect } from 'react'
import { useApi } from '@/lib/hooks/useApi'

export default function PlacesPage() {
  const { get, data, loading, error } = useApi()

  useEffect(() => {
    get('/api/public/places')
  }, [])

  if (loading) {
    return <div className="spinner">Loading places...</div>
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>
  }

  return (
    <div className="places-grid">
      {data?.places?.map((place: any) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  )
}
```

### Creating a Booking
```typescript
'use client'
import { useApi } from '@/lib/hooks/useApi'

export default function BookingForm({ hotelId }: { hotelId: string }) {
  const { post, loading, error } = useApi({
    onSuccess: (data) => {
      alert(`Booking confirmed! ID: ${data.bookingId}`)
    }
  })

  const handleBooking = async (bookingData: any) => {
    const token = localStorage.getItem('token')
    
    await post('/api/hotel-bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  return (
    <div>
      {/* Booking form fields */}
      <button 
        onClick={() => handleBooking({ hotelId, /* ... */ })}
        disabled={loading}
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </div>
  )
}
```

### Admin Dashboard - Fetching Multiple Resources
```typescript
'use client'
import { useEffect, useState } from 'react'
import { useApi } from '@/lib/hooks/useApi'

export default function AdminDashboard() {
  const [places, setPlaces] = useState([])
  const [hotels, setHotels] = useState([])
  const [bookings, setBookings] = useState([])
  
  const { get, loading } = useApi()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      const options = {
        headers: { 'Authorization': `Bearer ${token}` }
      }

      try {
        const [placesData, hotelsData, bookingsData] = await Promise.all([
          get('/api/admin/places', options),
          get('/api/admin/hotels', options),
          get('/api/admin/bookings', options)
        ])

        setPlaces(placesData.places)
        setHotels(hotelsData.hotels)
        setBookings(bookingsData.bookings)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="dashboard">
      <section>
        <h2>Places ({places.length})</h2>
        {/* Render places */}
      </section>
      <section>
        <h2>Hotels ({hotels.length})</h2>
        {/* Render hotels */}
      </section>
      <section>
        <h2>Bookings ({bookings.length})</h2>
        {/* Render bookings */}
      </section>
    </div>
  )
}
```

---

## Migration Checklist

To update existing components:

1. **Import the hook or helpers**
   ```typescript
   import { useApi } from '@/lib/hooks/useApi'
   // or
   import { getApiUrl, createFetchOptions } from '@/lib/config'
   ```

2. **Replace direct fetch calls**
   - Before: `fetch('/api/...')`
   - After: `fetch(getApiUrl('/api/...'))`
   - Or: Use `useApi()` hook

3. **Update headers**
   - Use `createFetchOptions()` for consistent headers
   - Or let `useApi()` handle it automatically

4. **Test with both configurations**
   - Same deployment: `NEXT_PUBLIC_API_URL=`
   - Separate backend: `NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com`

---

## Testing

### Test Backend Connection
```typescript
// Add to any component
import API_CONFIG from '@/lib/config'

console.log('Backend:', API_CONFIG.baseURL || 'Same deployment')

// Test health endpoint
fetch(getApiUrl('/api/health'))
  .then(res => res.json())
  .then(data => console.log('Backend health:', data))
  .catch(err => console.error('Backend unreachable:', err))
```

### Debug API Calls
```typescript
const { post, loading, error } = useApi({
  onSuccess: (data) => console.log('✅ Success:', data),
  onError: (error) => console.error('❌ Error:', error)
})
```

---

## Best Practices

1. **Always use the hook or helpers** - Don't hardcode URLs
2. **Handle loading states** - Show spinners during requests
3. **Handle errors gracefully** - Display user-friendly messages
4. **Use TypeScript** - Type your API responses
5. **Implement retry logic** - For failed requests
6. **Cache responses** - Use React Query or SWR
7. **Secure API calls** - Always include authentication tokens

---

## Common Patterns

### Authenticated Request
```typescript
const token = localStorage.getItem('token')
await post('/api/protected', data, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Query Parameters
```typescript
const params = new URLSearchParams({ category: 'temple', limit: '10' })
await get(`/api/places?${params}`)
```

### Pagination
```typescript
const [page, setPage] = useState(1)
await get(`/api/places?page=${page}&limit=20`)
```

### Search
```typescript
const [query, setQuery] = useState('')
await get(`/api/search?q=${encodeURIComponent(query)}`)
```

---

Your backend is configured and ready to use! 🚀

**Backend URL**: https://jharkhand-tourism-li3w.onrender.com
**All API endpoints**: https://jharkhand-tourism-li3w.onrender.com/api/*
