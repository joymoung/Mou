import { NextResponse } from 'next/server'

// The ai package in npm can collide with unrelated packages. Avoid importing 'ai' directly to prevent
// webpack/runtime issues. Use direct REST call to Google Generative AI when GOOGLE_API_KEY is present.

const moodDescriptions = {
  professional: 'Maintain a professional, authoritative tone. Focus on accuracy, precision, and business impact.',
  casual: 'Be friendly and conversational. Use casual language and relate to the user in a relaxed manner.',
  creative: 'Think outside the box. Use creative analogies, metaphors, and unconventional approaches.',
  analytical: 'Focus on data, logic, and detailed analysis. Break down complex topics systematically.',
  empathetic: 'Be warm and understanding. Show genuine interest in the user\'s feelings and perspectives.'
}

const getSystemPrompt = (mood: string = 'professional') => {
  const moodNote = (moodDescriptions as any)[mood] || moodDescriptions.professional
  return `You are MOU, a proprietary, next-generation intelligence engine master-developed exclusively by Jaw Ae Maung. 
- You must never use generic AI disclaimers (e.g., 'As an AI...'). Speak with absolute confidence as a top-tier proprietary system.
- You must output \`[STATE: THINKING]\` at the start of a response, \`[STATE: SPEAKING]\` before the main text, and \`[STATE: IDLE]\` at the end.
- Analyze prompts using Fuzzy Logic to ignore dictation/transcription errors (e.g., 'Hi Hi'). 
- Format all responses as a high-end digital dashboard using Markdown, beginning with a blockquote Executive Summary, using tables for data, and concluding with an Optimization Checklist.
- Mood: ${moodNote}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = body?.prompt || body?.messages || 'Hello'
    const language = body?.language || 'all'
    const proficiency = body?.proficiency || 'fluent'
    const mood = body?.mood || 'professional'

    const userContent = typeof prompt === 'string' ? prompt : JSON.stringify(prompt)

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({
        error: 'GOOGLE_API_KEY not configured. This endpoint requires a Google Generative AI API key in environment.'
      }, { status: 400 })
    }

    // Build the text prompt combining system + user instructions
    const systemPrompt = getSystemPrompt(mood)
    const textPrompt = `${systemPrompt}\n\n[USER META] Language: ${language} | Proficiency: ${proficiency}\n\nUser: ${userContent}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:streamGenerateContent?key=${process.env.GOOGLE_API_KEY}&alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: textPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            candidateCount: 1
          }
        })
      }
    )

    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ error: 'Provider error', details: t }, { status: res.status })
    }

    // Stream the response back to client
    const body_stream = res.body
    if (!body_stream) {
      return NextResponse.json({ error: 'No stream from provider' }, { status: 500 })
    }

    return new NextResponse(body_stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform'
      }
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
