import './globals.css'
import Footer from '../components/Footer'
import { NextIntlProvider } from 'next-intl'
import en from '../messages/en.json'

export const metadata = {
  title: 'MOU Nexus Core',
  description: 'MOU — proprietary intelligence engine by Jaw Ae Maung',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // For now default to English. Later this can be derived from cookies or Accept-Language.
  const messages = en

  return (
    <html lang="en" className="dark">
      <body>
        <NextIntlProvider locale="en" messages={messages}>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlProvider>
      </body>
    </html>
  )
}
