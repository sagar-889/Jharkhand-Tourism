#!/usr/bin/env node

/**
 * Test Backend Connection
 * Verifies that the backend API is accessible and responding correctly
 */

const https = require('https')
const http = require('http')

// Get backend URL from environment or use default
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

console.log('🔍 Testing Backend Connection...')
console.log(`📡 Backend URL: ${BACKEND_URL}\n`)

// Parse URL
const url = new URL(BACKEND_URL)
const protocol = url.protocol === 'https:' ? https : http

// Test endpoints
const endpoints = [
  { path: '/api/health', name: 'Health Check' },
  { path: '/api/public/places', name: 'Public Places' },
  { path: '/api/public/hotels', name: 'Public Hotels' },
  { path: '/api/public/restaurants', name: 'Public Restaurants' },
  { path: '/api/public/events', name: 'Public Events' },
]

let successCount = 0
let failCount = 0

// Test each endpoint
async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const fullUrl = `${BACKEND_URL}${endpoint.path}`
    
    const req = protocol.get(fullUrl, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${endpoint.name}: OK (${res.statusCode})`)
          successCount++
        } else {
          console.log(`⚠️  ${endpoint.name}: ${res.statusCode}`)
          failCount++
        }
        resolve()
      })
    })
    
    req.on('error', (error) => {
      console.log(`❌ ${endpoint.name}: ${error.message}`)
      failCount++
      resolve()
    })
    
    req.setTimeout(10000, () => {
      console.log(`⏱️  ${endpoint.name}: Timeout (10s)`)
      req.destroy()
      failCount++
      resolve()
    })
  })
}

// Run tests
async function runTests() {
  console.log('Testing endpoints...\n')
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint)
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`\n📊 Results: ${successCount} passed, ${failCount} failed\n`)
  
  if (failCount === 0) {
    console.log('🎉 All tests passed! Backend is working correctly.\n')
    process.exit(0)
  } else if (successCount > 0) {
    console.log('⚠️  Some tests failed. Check the errors above.\n')
    process.exit(1)
  } else {
    console.log('❌ All tests failed. Backend may be down or unreachable.\n')
    console.log('💡 Troubleshooting tips:')
    console.log('   1. Check if backend URL is correct')
    console.log('   2. Verify backend is deployed and running')
    console.log('   3. Wait 30-60 seconds if using Render free tier (cold start)')
    console.log('   4. Check Render dashboard for errors')
    console.log('   5. Test manually: curl ' + BACKEND_URL + '/api/health\n')
    process.exit(1)
  }
}

// Start tests
runTests().catch((error) => {
  console.error('❌ Test runner error:', error)
  process.exit(1)
})
