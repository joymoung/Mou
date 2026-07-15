import './globals.css'
import Footer from '../components/Footer'

export const metadata = {
  title: 'MOU Nexus Core',
  description: 'MOU — proprietary intelligence engine by Jaw Ae Maung',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
