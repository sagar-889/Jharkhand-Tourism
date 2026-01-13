# 🚀 AI Chatbot - Quick Start (2 Minutes)

## Step 1: Install Ollama

**Windows:** Download and install from https://ollama.com/download/windows

**Mac/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## Step 2: Download AI Model

```bash
ollama pull phi3
```

Wait for download to complete (~2.3GB)

## Step 3: Start Your App

```bash
npm run dev
```

## Step 4: Test It!

1. Open: http://localhost:3000/welcome
2. Click the **"Ask AI"** button (bottom-right corner)
3. Try these questions:

**English:**
```
What are the best places to visit in Jharkhand?
```

**Hindi:**
```
झारखंड में घूमने के लिए सबसे अच्छी जगहें कौन सी हैं?
```

**Telugu:**
```
జార్ఖండ్‌లో సందర్శించడానికి ఉత్తమ ప్రదేశాలు ఏమిటి?
```

## ✅ Done!

Your multilingual AI tourism assistant is ready!

---

## 🚨 Troubleshooting

**Problem:** "AI service is not available"

**Solution:**
```bash
ollama serve
```

---

## 📖 Full Documentation

See `AI_CHATBOT_SETUP.md` for complete guide.
