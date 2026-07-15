'use client'
import { useState, useEffect } from 'react'
import useLocalTranslations from '../components/useLocalTranslations'
import Sidebar from '../components/Sidebar'
import ChatStream from '../components/ChatStream'
import AvatarSync from '../components/AvatarSync'

export default function Page() {
  const t = useLocalTranslations()
  const [language, setLanguage] = useState('all')
  const [proficiency, setProficiency] = useState('fluent')
  const [avatarState, setAvatarState] = useState<'THINKING'|'SPEAKING'|'IDLE'>('IDLE')

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('mou:language')
      const storedProf = localStorage.getItem('mou:proficiency')
      if (storedLang) setLanguage(storedLang)
      if (storedProf) setProficiency(storedProf)
    } catch (e) {
      // ignore (server-side or disabled storage)
    }
  }, [])

  // Persist preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem('mou:language', language)
      localStorage.setItem('mou:proficiency', proficiency)
    } catch (e) {
      // ignore
    }
  }, [language, proficiency])

  return (
    <div className="min-h-screen flex">
      <div className="w-80 border-r border-white/6 p-4">
        <Sidebar language={language} setLanguage={setLanguage} proficiency={proficiency} setProficiency={setProficiency} />
      </div>
      <div className="flex-1 p-6">
        <div className="panel rounded-lg h-[75vh] flex">
          <div className="w-3/5 border-r border-white/6">
            <ChatStream language={language} proficiency={proficiency} onStateChange={(s) => setAvatarState(s)} />
          </div>
          <div className="w-2/5 p-6 flex flex-col items-center">
            <h3 className="text-sm text-gray-300">{t('avatarSync')}</h3>
            <AvatarSync state={avatarState} />
          </div>
        </div>
      </div>
    </div>
  )
}
