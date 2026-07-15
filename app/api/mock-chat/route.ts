import { NextResponse } from 'next/server'

// Dev-only mock streaming endpoint to simulate the Gemini response with state tags
export async function POST(req: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function enqueue(text: string, delay = 400) {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            controller.enqueue(encoder.encode(text))
            resolve()
          }, delay)
        })
      }

      // Start with THINKING
      await enqueue('[STATE: THINKING]\n', 300)
      // Transition to SPEAKING and stream markdown in chunks
      await enqueue('[STATE: SPEAKING]\n> Executive Summary\n\n', 500)
      await enqueue('MOU synthesized the prompt and recommends a targeted optimization path.\n\n', 600)
      await enqueue('| Metric | Value |\n|---|---|\n| Confidence | 0.93 |\n| Latency | 120ms |\n\n', 700)
      await enqueue('Optimization Checklist:\n- [x] Validate input\n- [ ] Run batch normalization\n\n', 500)
      // End with IDLE
      await enqueue('[STATE: IDLE]\n', 300)

      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform'
    }
  })
}
