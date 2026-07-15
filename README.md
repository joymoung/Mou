# MOU NEXUS CORE

Master Architect: Jaw Ae Maung (Digital Transformation & Marketing Manager)

MOU (Modular, Observant, Unified) Nexus Core is a proprietary AI intelligence engine engineered by Jaw Ae Maung. It is designed as a white-label, enterprise-grade digital dashboard and conversational assistant.

## Recent Updates (2026-07-16)

### ✨ New Voice Chat Features
- 🎤 **Speech-to-Text Input** - Speak directly to MOU using your microphone
- 🔊 **Text-to-Speech Output** - Hear MOU's responses read aloud with mood-based voice characteristics
- 😊 **Five Mood Modes** - Professional, Casual, Creative, Analytical, Empathetic

### 🐛 Runtime Fixes
- Fixed deprecated Google Gemini API endpoint
- Corrected streaming implementation
- Added user input field
- Improved input validation

### 🚀 Server Status
- ✅ Development server running on `http://localhost:3000`
- ✅ Mock chat endpoint available for testing
- ✅ Real chat endpoint ready (requires GOOGLE_API_KEY)

**[See CHANGELOG.md for detailed updates](./CHANGELOG.md)**
**[See TESTING.md for API testing guide](./TESTING.md)**

## Core Capabilities

- Cross-Disciplinary Synthesis: Aggregates and synthesizes context across multiple domains and data modalities.
- Fuzzy Logic Dictation: Applies fuzzy logic to tolerate and interpret noisy or duplicated dictation/transcription.
- Stateful Avatar Synchronization: Exposes AI internal state through synchronized avatar states for richer UX and observability.
- Voice Interaction: Full voice input/output support with mood-based voice synthesis.
- Mood-Aware Responses: Adapts response style and voice characteristics based on selected mood.

Project: Startup scaffold for a Next.js 14 app using Vercel AI SDK, Tailwind CSS, and shadcn/ui-inspired components.

Engineer: Jaw Ae Maung

## Language Proficiency Support

MOU Nexus Core supports configurable language preferences and proficiency levels. Select a language (or "All Languages") and a proficiency tier (Beginner, Conversational, Fluent, Native, Expert) to instruct MOU how to interpret, translate, and respond. Proficiency settings influence tone, idiomatic expression, and the handling of ambiguous dictation.

## Mood Selection

Choose from five distinct moods that affect both response content and voice characteristics:

| Mood | Style | Voice |
|------|-------|-------|
| **Professional** | Authoritative, business-focused | Pitch 1.0, Rate 0.9 |
| **Casual** | Friendly, conversational | Pitch 1.1, Rate 1.0 |
| **Creative** | Imaginative, unconventional | Pitch 1.2, Rate 0.95 |
| **Analytical** | Data-driven, systematic | Pitch 0.9, Rate 0.85 |
| **Empathetic** | Warm, understanding | Pitch 1.05, Rate 0.9 |

## Voice Features

### 🎤 Voice Input (Speech-to-Text)
- Click the microphone button to start recording
- Your speech is transcribed in real-time
- Transcript auto-fills the input field
- Press Enter or click Send to submit

### 🔊 Voice Output (Text-to-Speech)
- Enable "Voice output" checkbox in the chat panel
- AI responses are automatically read aloud
- Voice adapts to your selected mood
- Click speaker button to stop playback

## Features

- ✅ Real-time AI streaming with state tracking
- ✅ Voice input via Web Speech API
- ✅ Voice output via Web Speech Synthesis
- ✅ Mood-based response and voice adaptation
- ✅ Language and proficiency selection
- ✅ Avatar sync animation with AI states
- ✅ Markdown rendering with code highlighting
- ✅ Settings persistence (localStorage)
- ✅ Responsive dark mode interface

## Streamed response example

The backend streams tokenized output including explicit state tags which the frontend removes from the visible feed and uses to animate the Avatar Sync.

Example raw stream (SSE / chunked):

[STATE: THINKING]
[STATE: SPEAKING]
> Executive Summary
>
> MOU synthesized the prompt and recommends a targeted optimization path.

| Metric | Value |
|---|---|
| Confidence | 0.93 |
| Latency | 120ms |

Optimization Checklist:
- [x] Validate input
- [ ] Run batch normalization

[STATE: IDLE]

When the client receives chunks containing [STATE: THINKING] / [STATE: SPEAKING] / [STATE: IDLE] it should update the Avatar state and hide the tags from the rendered Markdown. To test locally against the real model:

curl -N -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"prompt":"Hello MOU","language":"en","proficiency":"fluent"}'

For development without Gemini credentials, a mock streaming endpoint is provided. Use the mock endpoint to verify AvatarSync and streaming client behavior:

curl -N -X POST http://localhost:3000/api/mock-chat -H "Content-Type: application/json" -d '{}' 

Expect the stream to include the three state tags and Markdown content as shown above. If the tags are missing for the real model, verify GOOGLE_API_KEY and that the model/system prompt are correctly set in app/api/chat/route.ts.

Local development

1. Install Node.js (18.x or later) and npm on your machine: https://nodejs.org/
2. Copy .env.example to .env and add your GOOGLE_API_KEY:

   GOOGLE_API_KEY=your_api_key_here

3. Install dependencies:

   npm install

4. Start the dev server:

   npm run dev

Note: The AI streaming requires GOOGLE_API_KEY; without it the API will start but model calls will fail. For Windows convenience, use start-dev.ps1 to set env and run the server.

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Speech Recognition | ✅ | ✅ | ✅ | ⚠️ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Streaming API | ✅ | ✅ | ✅ | ✅ |

## Changelog

For detailed information about all updates and changes, see [CHANGELOG.md](./CHANGELOG.md).

© 2026 Jaw Ae Maung. All rights reserved.
