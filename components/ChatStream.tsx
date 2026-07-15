'use client'
import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatStream({ language, proficiency, onStateChange }: { language: string, proficiency: string, onStateChange?: (s: 'THINKING'|'SPEAKING'|'IDLE') => void }) {
  const [messages, setMessages] = useState<Array<{id:string, text:string}>>([
    { id: 'm1', text: '> Executive summary will appear here.\n\n[STATE: IDLE]'}
  ])
  const [avatarState, setAvatarState] = useState<'THINKING'|'SPEAKING'|'IDLE'>('IDLE')

  useEffect(() => {
    // placeholder for live updates
  }, [])

  function updateState(state: 'THINKING'|'SPEAKING'|'IDLE') {
    setAvatarState(state)
    if (onStateChange) onStateChange(state)
  }

  function handleIncoming(text: string) {
    // intercept state tags and update avatar
    if (text.includes('[STATE: THINKING]')) { updateState('THINKING'); }
    if (text.includes('[STATE: SPEAKING]')) { updateState('SPEAKING'); }
    if (text.includes('[STATE: IDLE]')) { updateState('IDLE'); }
    const cleaned = text.replace(/\[STATE: (THINKING|SPEAKING|IDLE)\]/g, '').trim()
    setMessages(m => [...m, { id: `m${m.length+1}`, text: cleaned }])
  }

  async function sendPrompt() {
    handleIncoming('[STATE: THINKING]')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Hello MOU', language, proficiency })
      })
      const text = await res.text()
      handleIncoming(text)
      handleIncoming('[STATE: IDLE]')
    } catch (e) {
      handleIncoming('Error contacting engine. [STATE: IDLE]')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 markdown">
        {messages.map(m => (
          <div key={m.id} className="mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/6 flex items-center gap-3">
        <button className="px-4 py-2 rounded bg-accent text-black" onClick={sendPrompt}>Send Demo</button>
        <div className="text-sm text-gray-400">Lang: {language} • Proficiency: {proficiency}</div>
      </div>
    </div>
  )
}
