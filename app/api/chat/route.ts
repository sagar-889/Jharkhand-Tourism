import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Ollama API endpoint (local)
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'
    
    const systemPrompt = `You are a helpful Jharkhand Tourism Assistant. 
Your role is to provide accurate information about:
- Tourist places in Jharkhand (Ranchi, Jamshedpur, Deoghar, Netarhat, Betla National Park, etc.)
- Hotels and accommodations
- Local cuisine and restaurants
- Cultural events and festivals
- Travel tips and best times to visit
- Transportation and how to reach places

IMPORTANT RULES:
1. ONLY answer questions related to Jharkhand tourism
2. Reply in the SAME LANGUAGE as the user's question
3. If asked about other topics, politely redirect to Jharkhand tourism
4. Be friendly, helpful, and concise
5. Support multiple languages: English, Hindi, Telugu, Bengali, and others

User's question: ${message}`

    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3',
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      })
    })

    if (!response.ok) {
      throw new Error('Ollama API request failed')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      reply: data.response,
      success: true 
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    // Check if Ollama is running
    if (error.message.includes('fetch') || error.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: 'AI service is not available. Please ensure Ollama is running.',
        reply: 'Sorry, the AI assistant is currently offline. Please try again later or contact support.',
        success: false 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to process chat request',
      success: false 
    }, { status: 500 })
  }
}
