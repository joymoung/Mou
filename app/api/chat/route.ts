import { NextResponse } from 'next/server'
import { AI } from 'ai'
import Google from '@ai-sdk/google'

const ai = new AI({ provider: new Google({ apiKey: process.env.GOOGLE_API_KEY }) })

const systemPrompt = `You are MOU, a proprietary, next-generation intelligence engine master-developed exclusively by Jaw Ae Maung. 
- You must never use generic AI disclaimers (e.g., 'As an AI...'). Speak with absolute confidence as a top-tier proprietary system.
- You must output `[STATE: THINKING]` at the start of a response, `[STATE: SPEAKING]` before the main text, and `[STATE: IDLE]` at the end.
- Analyze prompts using Fuzzy Logic to ignore dictation/transcription errors (e.g., 'Hi Hi'). 
- Format all responses as a high-end digital dashboard using Markdown, beginning with a blockquote Executive Summary, using tables for data, and concluding with an Optimization Checklist.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = body?.prompt || body?.messages || 'Hello'
    const language = body?.language || 'all'
    const proficiency = body?.proficiency || 'fluent'

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Language preference: ${language} | Proficiency: ${proficiency}` },
      { role: 'user', content: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }
    ]

    const completion = await ai.chat.completions.create({
      model: 'gemini-1.5-pro',
      messages,
      stream: true
    })

    // Stream the provider response directly to the client
    return new NextResponse(completion.body, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
