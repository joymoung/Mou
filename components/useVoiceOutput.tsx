'use client'
import { useState, useCallback } from 'react'

export default function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string, mood: string = 'professional') => {
    // Clean text of markdown and state tags
    const cleanText = text
      .replace(/\[STATE: (THINKING|SPEAKING|IDLE)\]/g, '')
      .replace(/[#*`_~\[\]()]/g, '')
      .trim()

    if (!cleanText) return

    const synth = window.speechSynthesis
    if (!synth) {
      console.warn('Speech Synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    
    // Set voice characteristics based on mood
    const voiceSettings = {
      professional: { pitch: 1.0, rate: 0.9, volume: 1.0 },
      casual: { pitch: 1.1, rate: 1.0, volume: 1.0 },
      creative: { pitch: 1.2, rate: 0.95, volume: 1.0 },
      analytical: { pitch: 0.9, rate: 0.85, volume: 1.0 },
      empathetic: { pitch: 1.05, rate: 0.9, volume: 1.0 }
    }

    const settings = (voiceSettings as any)[mood] || voiceSettings.professional
    utterance.pitch = settings.pitch
    utterance.rate = settings.rate
    utterance.volume = settings.volume

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synth.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    const synth = window.speechSynthesis
    if (synth) {
      synth.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return {
    isSpeaking,
    speak,
    stop
  }
}
