'use client'
import { useState, useEffect } from 'react'

export default function useLocalTranslations() {
  const [messages, setMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true
    // Load English messages by default; future work can select locale via cookie
    import('../messages/en.json')
      .then((m) => {
        if (!mounted) return
        setMessages((m as any).default || m)
      })
      .catch(() => {
        setMessages({})
      })
    return () => { mounted = false }
  }, [])

  return (key: string) => messages[key] ?? key
}
