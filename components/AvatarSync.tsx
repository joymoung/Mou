'use client'
import { useEffect } from 'react'
import useLocalTranslations from './useLocalTranslations'

export default function AvatarSync({ state }: { state: 'THINKING' | 'SPEAKING' | 'IDLE' }) {
  const t = useLocalTranslations()
  useEffect(() => {
    // side effects or analytics hooks could be placed here
  }, [state])

  const cls = `avatar-orb panel mx-auto ${state === 'THINKING' ? 'avatar-thinking' : state === 'SPEAKING' ? 'avatar-speaking' : 'avatar-idle'}`
  return (
    <div className="flex flex-col items-center p-4">
      <div className={cls} aria-hidden />
      <div className="mt-3 text-center text-sm text-gray-300">{t('state')}: {state}</div>
    </div>
  )
}
