# MOU NEXUS CORE

Master Architect: Jaw Ae Maung (Digital Transformation & Marketing Manager)

MOU (Modular, Observant, Unified) Nexus Core is a proprietary AI intelligence engine engineered by Jaw Ae Maung. It is designed as a white-label, enterprise-grade digital dashboard and conversational assistant.

Core Capabilities

- Cross-Disciplinary Synthesis: Aggregates and synthesizes context across multiple domains and data modalities.
- Fuzzy Logic Dictation: Applies fuzzy logic to tolerate and interpret noisy or duplicated dictation/transcription.
- Stateful Avatar Synchronization: Exposes AI internal state through synchronized avatar states for richer UX and observability.

Project: Startup scaffold for a Next.js 14 app using Vercel AI SDK, Tailwind CSS, and shadcn/ui-inspired components.

Engineer: Jaw Ae Maung

Language Proficiency Support

MOU Nexus Core supports configurable language preferences and proficiency levels. Select a language (or "All Languages") and a proficiency tier (Beginner, Conversational, Fluent, Native, Expert) to instruct MOU how to interpret, translate, and respond. Proficiency settings influence tone, idiomatic expression, and the handling of ambiguous dictation.

© 2026 Jaw Ae Maung. All rights reserved.

Streamed response example

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
