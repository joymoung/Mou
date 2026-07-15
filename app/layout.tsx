import './globals.css'
import Footer from '../components/Footer'
import { headers } from 'next/headers'
import './globals.css'
import Footer from '../components/Footer'

export const metadata = {
  title: 'MOU Nexus Core',
  description: 'MOU — proprietary intelligence engine by Jaw Ae Maung',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Detect preferred locale from Accept-Language header (server-side)
  const h = headers()
  const acceptLang = h.get('accept-language') || ''
  const primary = acceptLang.split(',')[0]?.split('-')[0] || 'en'
  const supported = ['en', 'es']
  const locale = supported.includes(primary) ? primary : 'en'

  // Load messages dynamically for the detected locale (kept for future i18n)
  try {
    // dynamic import must use a literal-like path; this works in Next.js when files exist
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    await import(`../messages/${locale}.json`)
  } catch (e) {
    await import('../messages/en.json')
  }

  return (
    <html lang={locale} className="dark">
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
