import './globals.css'
import Footer from '../components/Footer'
import NextIntlProvider from 'next-intl/dist/src/react-server/NextIntlClientProvider'
import { headers } from 'next/headers'

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

  // Load messages dynamically for the detected locale
  let messages = {}
  try {
    // dynamic import must use a literal-like path; this works in Next.js when files exist
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    messages = (await import(`../messages/${locale}.json`)).default
  } catch (e) {
    messages = (await import('../messages/en.json')).default
  }

  return (
    <html lang={locale} className="dark">
      <body>
        <NextIntlProvider locale={locale} messages={messages}>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlProvider>
      </body>
    </html>
  )
}
