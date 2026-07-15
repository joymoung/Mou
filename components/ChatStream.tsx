'use client'
import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useLocalTranslations from './useLocalTranslations'
import useVoiceRecognition from './useVoiceRecognition'
import useVoiceOutput from './useVoiceOutput'

export default function ChatStream({ language, proficiency, mood = 'professional', onStateChange }: { language: string, proficiency: string, mood?: string, onStateChange?: (s: 'THINKING'|'SPEAKING'|'IDLE') => void }) {
  const t = useLocalTranslations()
  const [messages, setMessages] = useState<Array<{id:string, text:string}>>([
    { id: 'm1', text: '> Executive summary will appear here.\n\n[STATE: IDLE]'}
  ])
  const [avatarState, setAvatarState] = useState<'THINKING'|'SPEAKING'|'IDLE'>('IDLE')
  const [input, setInput] = useState('')
  const [enableVoiceOutput, setEnableVoiceOutput] = useState(false)
  const streamIdRef = useRef<string | null>(null)
  const lastMessageRef = useRef<string>('')
  
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useVoiceRecognition()
  const { isSpeaking, speak, stop: stopSpeaking } = useVoiceOutput()

  useEffect(() => {
    // placeholder for live updates
  }, [])

  function updateState(state: 'THINKING'|'SPEAKING'|'IDLE') {
    setAvatarState(state)
    if (onStateChange) onStateChange(state)
  }

  function handleIncoming(text: string, streamId?: string) {
    // intercept state tags and update avatar
    if (text.includes('[STATE: THINKING]')) { updateState('THINKING'); }
    if (text.includes('[STATE: SPEAKING]')) { updateState('SPEAKING'); }
    if (text.includes('[STATE: IDLE]')) { 
      updateState('IDLE')
      // Speak the accumulated message if voice output enabled
      if (enableVoiceOutput && lastMessageRef.current) {
        speak(lastMessageRef.current, mood)
      }
    }
    const cleaned = text.replace(/\[STATE: (THINKING|SPEAKING|IDLE)\]/g, '').trim()
    if (!cleaned) return

    if (streamId) {
      // update existing streaming message
      lastMessageRef.current += cleaned
      setMessages(prev => prev.map(m => m.id === streamId ? { ...m, text: m.text + cleaned } : m))
    } else {
      lastMessageRef.current = cleaned
      setMessages(m => [...m, { id: `m${m.length+1}`, text: cleaned }])
    }
  }

  async function sendPrompt() {
    const promptText = transcript || input
    if (!promptText.trim()) return
    
    // Add user message to chat
    setMessages(prev => [...prev, { id: `m-user-${Date.now()}`, text: `**You:** ${promptText}` }])
    
    // create a streaming message slot
    const sid = `s${Date.now()}`
    streamIdRef.current = sid
    lastMessageRef.current = ''
    setMessages(prev => [...prev, { id: sid, text: '' }])
    updateState('THINKING')
    setInput('')
    resetTranscript()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, language, proficiency, mood })
      })

      if (!res.ok) {
        const err = await res.text()
        handleIncoming(`Error: ${err} [STATE: IDLE]`)
        updateState('IDLE')
        streamIdRef.current = null
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream from server')
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          // process chunk: may contain partial tokens; handleIncoming will manage state tags
          handleIncoming(chunk, sid)
        }
        done = !!doneReading
      }

      // stream ended
      handleIncoming('[STATE: IDLE]', sid)
      updateState('IDLE')
      streamIdRef.current = null
    } catch (e) {
      handleIncoming(`Error contacting engine. [STATE: IDLE]`)
      updateState('IDLE')
      streamIdRef.current = null
    }
  }

  function handleVoiceStart() {
    resetTranscript()
    startListening()
  }

  function handleVoiceEnd() {
    stopListening()
    setInput(transcript)
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
      <div className="p-4 border-t border-white/6">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={transcript || input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
            placeholder={t('sendDemo') || 'Ask MOU...'}
            className="flex-1 bg-transparent border border-white/6 p-2 rounded text-white placeholder-gray-500"
          />
          <button
            onClick={isListening ? handleVoiceEnd : handleVoiceStart}
            className={`px-3 py-2 rounded ${isListening ? 'bg-red-500 text-white' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            🎤
          </button>
          <button
            onClick={sendPrompt}
            className="px-4 py-2 rounded bg-accent text-black hover:opacity-90"
          >
            {t('sendDemo')}
          </button>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-2 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
              title="Stop voice output"
            >
              🔊
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>{`${t('language')}: ${language} • ${t('proficiency')}: ${proficiency}`}</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableVoiceOutput}
              onChange={(e) => setEnableVoiceOutput(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Voice output</span>
          </label>
        </div>
      </div>
    </div>
  )
}
