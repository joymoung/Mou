'use client'
import React from 'react'
import useLocalTranslations from './useLocalTranslations'

export default function Sidebar({ language, setLanguage, proficiency, setProficiency, mood, setMood }: {
  language: string,
  setLanguage: (l: string) => void,
  proficiency: string,
  setProficiency: (p: string) => void,
  mood?: string,
  setMood?: (m: string) => void
}) {
  const t = useLocalTranslations()

  function onLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setLanguage(val)
    try {
      if (val === 'all') {
        // clear cookie
        document.cookie = `NEXT_LOCALE=; Max-Age=0; path=/`
      } else {
        document.cookie = `NEXT_LOCALE=${val}; path=/`
      }
      // reload so server-side layout picks up new locale
      location.reload()
    } catch (err) {
      // ignore in environments without document
    }
  }

  function onProficiencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setProficiency(val)
    try { localStorage.setItem('mou:proficiency', val) } catch {}
  }

  function onMoodChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    if (setMood) {
      setMood(val)
      try { localStorage.setItem('mou:mood', val) } catch {}
    }
  }

  return (
    <aside className="w-80 p-4 panel">
      <div className="mb-6">
        <h3 className="text-xs uppercase text-muted text-gray-400">{t('history')}</h3>
        <div className="mt-3 text-sm text-gray-300">(Chat history placeholder)</div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs text-gray-400">{t('language')}</h4>
        <div className="mt-3">
          <select className="w-full bg-transparent border border-white/6 p-2 rounded" value={language} onChange={onLanguageChange}>
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      <div>
        <h4 className="text-xs text-gray-400">{t('proficiency')}</h4>
        <div className="mt-3">
          <select className="w-full bg-transparent border border-white/6 p-2 rounded" value={proficiency} onChange={onProficiencyChange}>
            <option value="beginner">Beginner</option>
            <option value="conversational">Conversational</option>
            <option value="fluent">Fluent</option>
            <option value="native">Native</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xs text-gray-400">Mood</h4>
        <div className="mt-3">
          <select className="w-full bg-transparent border border-white/6 p-2 rounded" value={mood || 'professional'} onChange={onMoodChange}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="analytical">Analytical</option>
            <option value="empathetic">Empathetic</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xs text-gray-400">{t('systemStatus')}</h4>
        <ul className="mt-3 space-y-2 text-sm text-gray-300">
          <li>Core: <span className="text-accent">Online</span></li>
          <li>Model: gemini-1.5-pro</li>
          <li>Avatar Sync: Active</li>
        </ul>
      </div>
    </aside>
  )
}
