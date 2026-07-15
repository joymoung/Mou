# API Testing Guide

## Server Status

✅ **Server Running** on `http://localhost:3000`

## Endpoints

### 1. Mock Chat Endpoint (For Development)
Simulates MOU responses without requiring API credentials.

```bash
curl -X POST http://localhost:3000/api/mock-chat \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:** Streaming text-event-stream with state tags

**Status:** ✅ **200 OK**

### 2. Real Chat Endpoint (Requires Google API Key)
Connects to Google Gemini AI for real intelligence responses.

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello MOU",
    "language": "en",
    "proficiency": "fluent",
    "mood": "professional"
  }'
```

**Parameters:**
- `prompt` (string) - User message
- `language` (string, optional) - Language code (default: "all")
- `proficiency` (string, optional) - Proficiency level: beginner, conversational, fluent, native, expert (default: "fluent")
- `mood` (string, optional) - Mood: professional, casual, creative, analytical, empathetic (default: "professional")

**Response:** Streaming text-event-stream with state tags

**Status (No API Key):** ❌ **400 Bad Request** (Expected)

**Status (With API Key):** ✅ **200 OK**

## Environment Setup

### To use the real chat endpoint:

1. Get a Google Generative AI API key from: https://aistudio.google.com/app/apikey

2. Set environment variable:
   ```bash
   # Windows (PowerShell)
   $env:GOOGLE_API_KEY = "your_api_key_here"
   
   # Windows (CMD)
   set GOOGLE_API_KEY=your_api_key_here
   
   # macOS/Linux
   export GOOGLE_API_KEY=your_api_key_here
   ```

3. Or create `.env` file in project root:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

4. Restart the dev server

## Response Format

Both endpoints stream responses with state indicators:

```
[STATE: THINKING]
[STATE: SPEAKING]
> Executive Summary

MOU synthesized the prompt and recommends a targeted optimization path.

| Metric | Value |
|---|---|
| Confidence | 0.93 |
| Latency | 120ms |

Optimization Checklist:
- [x] Validate input
- [ ] Run batch normalization

[STATE: IDLE]
```

**State Tags:**
- `[STATE: THINKING]` - AI is processing the request
- `[STATE: SPEAKING]` - AI is generating response
- `[STATE: IDLE]` - Response complete

## UI Testing

### Voice Features

1. **🎤 Voice Input (Speech-to-Text)**
   - Click microphone button in input area
   - Speak clearly into microphone
   - Speech is transcribed to text input field
   - Click Send or press Enter to submit

2. **🔊 Voice Output (Text-to-Speech)**
   - Enable "Voice output" checkbox
   - Responses are automatically read aloud
   - Click speaker button to stop playback

### Mood Selection

1. Select mood from dropdown in Sidebar (Professional, Casual, Creative, Analytical, Empathetic)
2. Response style and voice characteristics adapt to mood
3. Selection persists across sessions

### Browser Console

Open DevTools (F12) to see:
- Voice recognition transcripts
- State changes (THINKING → SPEAKING → IDLE)
- API response streaming
- Any console errors

## Troubleshooting

### Server not starting
```bash
# Kill any existing node processes
taskkill /IM node.exe /F

# Reinstall dependencies
npm install

# Start server
npm run dev
```

### 405 Method Not Allowed
- Ensure you're using POST method, not GET
- Check Content-Type header is application/json

### 400 Bad Request on /api/chat
- GOOGLE_API_KEY environment variable not set
- Use /api/mock-chat for testing without API key

### Speech Recognition not working
- Check browser compatibility (Chrome, Edge, Firefox)
- Allow microphone permission when prompted
- Some corporate networks may block microphone access

### Speech Synthesis not working
- Check browser volume is not muted
- Verify browser supports Web Speech API
- Some operating systems may require additional setup

## Performance Notes

- **First request:** May take 2-3 seconds (model loading)
- **Subsequent requests:** 1-2 seconds typical
- **Voice recognition:** Real-time, 1-2 seconds per sentence
- **Voice synthesis:** Plays at normal speech rate (~150 WPM)

## Next Steps

1. ✅ Install and configure GOOGLE_API_KEY
2. ✅ Test both mock and real endpoints
3. ✅ Verify voice features in browser
4. ✅ Deploy to production when ready
