# 🤖 AI Chatbot Setup Guide - Jharkhand Tourism

## Overview
Multilingual AI Tourism Assistant powered by **Ollama + Phi-3** running locally.

### Features:
- ✅ Multilingual support (Hindi, English, Telugu, Bengali, etc.)
- ✅ Jharkhand tourism-specific knowledge
- ✅ Real-time chat interface
- ✅ Floating chat button
- ✅ Beautiful UI with message history
- ✅ Local AI (no API costs!)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Ollama

**Windows:**
1. Download from: https://ollama.com/download/windows
2. Run the installer
3. Ollama will start automatically

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download Phi-3 Model

Open terminal/command prompt:
```bash
ollama pull phi3
```

This will download the Phi-3 model (~2.3GB). Wait for it to complete.

### Step 3: Verify Ollama is Running

```bash
ollama list
```

You should see `phi3` in the list.

### Step 4: Start Your Next.js App

```bash
npm run dev
```

### Step 5: Test the Chatbot

1. Open http://localhost:3000/welcome
2. Click the floating "Ask AI" button (bottom right)
3. Try asking in different languages:
   - English: "What are the best places to visit in Jharkhand?"
   - Hindi: "झारखंड में घूमने के लिए सबसे अच्छी जगहें कौन सी हैं?"
   - Telugu: "జార్ఖండ్‌లో సందర్శించడానికి ఉత్తమ ప్రదేశాలు ఏమిటి?"

---

## 📁 Files Added

```
app/
├── api/
│   └── chat/
│       └── route.ts          # API endpoint for chat
├── components/
│   └── Chatbot.tsx           # Chat UI component
└── welcome/
    └── page.tsx              # Updated with chatbot
```

---

## 🎨 Chatbot Features

### 1. Floating Button
- Always visible in bottom-right corner
- Click to open/close chat window

### 2. Chat Interface
- Message history
- User and AI messages clearly distinguished
- Timestamps
- Loading indicators
- Smooth animations

### 3. Multilingual Support
The AI automatically detects and responds in the user's language:
- English
- Hindi (हिंदी)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- And more!

### 4. Tourism-Specific
Only answers questions about:
- Tourist places in Jharkhand
- Hotels and accommodations
- Local cuisine
- Cultural events
- Travel tips
- Transportation

---

## 🔧 Configuration

### Environment Variables (Optional)

Add to `.env.local`:
```env
OLLAMA_URL=http://localhost:11434/api/generate
```

Default is `http://localhost:11434/api/generate`

### Change AI Model

In `app/api/chat/route.ts`, change:
```typescript
model: 'phi3'  // Change to 'llama2', 'mistral', etc.
```

Available models:
```bash
ollama list    # See installed models
ollama pull llama2    # Install other models
```

---

## 🧪 Testing

### Test Questions:

**English:**
- "What are the top tourist places in Jharkhand?"
- "Tell me about Betla National Park"
- "Best time to visit Ranchi?"

**Hindi:**
- "झारखंड के प्रमुख पर्यटन स्थल बताइए"
- "बेतला राष्ट्रीय उद्यान के बारे में बताएं"
- "रांची घूमने का सबसे अच्छा समय?"

**Telugu:**
- "జార్ఖండ్‌లో ప్రధాన పర్యాటక ప్రదేశాలు ఏమిటి?"
- "బెట్లా నేషనల్ పార్క్ గురించి చెప్పండి"

---

## 🚨 Troubleshooting

### Issue 1: "AI service is not available"
**Solution:**
```bash
# Check if Ollama is running
ollama list

# If not running, start it
ollama serve
```

### Issue 2: Model not found
**Solution:**
```bash
# Download the model
ollama pull phi3
```

### Issue 3: Slow responses
**Reasons:**
- First response is always slower (model loading)
- Large models need more RAM
- CPU-based inference is slower than GPU

**Solutions:**
- Use smaller models: `ollama pull phi3:mini`
- Ensure 8GB+ RAM available
- Close other heavy applications

### Issue 4: Chat not appearing
**Solution:**
- Check browser console for errors
- Verify Ollama is running on port 11434
- Check if chatbot component is imported

---

## 📊 Performance

### Model Sizes:
- **phi3**: ~2.3GB (Recommended)
- **phi3:mini**: ~1.5GB (Faster, less accurate)
- **llama2**: ~3.8GB (More accurate, slower)

### Response Times:
- First message: 5-10 seconds (model loading)
- Subsequent messages: 2-5 seconds
- Depends on: CPU, RAM, model size

---

## 🌐 Deployment Considerations

### ⚠️ Important: Local Only

This chatbot runs **locally** and **cannot be deployed** to:
- ❌ Vercel
- ❌ Netlify
- ❌ Render (without custom setup)

### Why?
- Ollama requires a local server
- Models are too large for serverless
- Needs persistent compute resources

### Deployment Options:

#### Option 1: Local Demo (Recommended for College Projects)
- Run on your laptop during presentations
- Perfect for demos and testing
- No deployment costs

#### Option 2: Self-Hosted Server
- Deploy on VPS (DigitalOcean, AWS EC2, etc.)
- Install Ollama on server
- Update `OLLAMA_URL` to server address
- Requires: 8GB+ RAM, 20GB+ storage

#### Option 3: API-Based Alternative (For Production)
Replace Ollama with cloud AI APIs:
- OpenAI GPT-4
- Google Gemini
- Anthropic Claude
- Cohere

Example with OpenAI:
```typescript
// app/api/chat/route.ts
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }]
  })
})
```

---

## 🎓 For College Projects

### Presentation Tips:

1. **Demo Setup:**
   - Ensure Ollama is running before presentation
   - Test all languages beforehand
   - Have backup questions ready

2. **Highlight Features:**
   - Local AI (no internet needed after setup)
   - Multilingual support
   - Tourism-specific responses
   - Beautiful UI

3. **Technical Points:**
   - Explain Ollama architecture
   - Show model size and performance
   - Discuss privacy benefits (data stays local)

---

## 📚 Additional Resources

- **Ollama Docs**: https://ollama.com/docs
- **Phi-3 Model**: https://ollama.com/library/phi3
- **Alternative Models**: https://ollama.com/library

---

## 🔐 Privacy & Security

### Benefits of Local AI:
- ✅ User data never leaves the device
- ✅ No API keys needed
- ✅ No usage costs
- ✅ Works offline (after model download)
- ✅ GDPR compliant

---

## 💡 Future Enhancements

1. **Voice Input**: Add speech-to-text
2. **Image Support**: Upload photos for recommendations
3. **Context Memory**: Remember previous conversations
4. **Booking Integration**: Direct booking from chat
5. **Location-Based**: GPS-based recommendations

---

## 🆘 Support

For issues:
1. Check Ollama is running: `ollama list`
2. Verify model is downloaded: `ollama pull phi3`
3. Check browser console for errors
4. Restart Ollama: `ollama serve`

---

## ✅ Checklist

- [ ] Ollama installed
- [ ] Phi-3 model downloaded
- [ ] Ollama running (port 11434)
- [ ] Next.js app running
- [ ] Chatbot visible on /welcome page
- [ ] Tested in multiple languages
- [ ] Responses are tourism-specific

---

**🎉 Enjoy your AI-powered Jharkhand Tourism Assistant!**
