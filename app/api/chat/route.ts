import { NextResponse } from 'next/server'

// The ai package in npm can collide with unrelated packages. Avoid importing 'ai' directly to prevent
// webpack/runtime issues. Use direct REST call to Google Generative AI when GOOGLE_API_KEY is present.

const systemPrompt = `You are MOU, a proprietary, next-generation intelligence engine master-developed exclusively by Jaw Ae Maung. 
- You must never use generic AI disclaimers (e.g., 'As an AI...'). Speak with absolute confidence as a top-tier proprietary system.
- You must output \`[STATE: THINKING]\` at the start of a response, \`[STATE: SPEAKING]\` before the main text, and \`[STATE: IDLE]\` at the end.
- Analyze prompts using Fuzzy Logic to ignore dictation/transcription errors (e.g., 'Hi Hi'). 
- Format all responses as a high-end digital dashboard using Markdown, beginning with a blockquote Executive Summary, using tables for data, and concluding with an Optimization Checklist.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = body?.prompt || body?.messages || 'Hello'
    const language = body?.language || 'all'
    const proficiency = body?.proficiency || 'fluent'

    const userContent = typeof prompt === 'string' ? prompt : JSON.stringify(prompt)

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({
        error: 'GOOGLE_API_KEY not configured. This endpoint requires a Google Generative AI API key in environment.'
      }, { status: 400 })
    }

    // Build the text prompt combining system + user instructions
    const textPrompt = `${systemPrompt}\n\n[USER META] Language: ${language} | Proficiency: ${proficiency}\n\nUser: ${userContent}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateText?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: { text: textPrompt },
          temperature: 0.2,
          candidateCount: 1
        })
      }
    )

    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ error: 'Provider error', details: t }, { status: res.status })
    }

    const data = await res.json()
    // Try to extract generated text from common places
    let text = ''
    if (data && data.candidates && data.candidates[0]) {
      // new GA API may put the text in candidates[0].output or candidates[0].content
      text = data.candidates[0].output || data.candidates[0].content || JSON.stringify(data.candidates[0])
    } else if (data?.output?.[0]?.content) {
      text = data.output[0].content
    } else {
      text = JSON.stringify(data)
    }

    return NextResponse.json({ text })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
