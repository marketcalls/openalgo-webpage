import { Sora, Manrope, IBM_Plex_Mono } from 'next/font/google'
import { Navbar } from '@/components/navbar.jsx'
import { Footer } from '@/components/footer.jsx'
import { defaultMetadata } from './metadata'
import './globals.css'

// Self-host the fonts via next/font. This removes the render-blocking request to
// fonts.googleapis.com and emits size-adjust fallback metrics, which fixes the
// font-swap layout shift (CLS).
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-ibm-mono', display: 'swap' })

export const metadata = {
  ...defaultMetadata,
  icons: {
    icon: '/assets/images/favicon.ico',
    apple: '/assets/images/apple-touch-icon.png',
    shortcut: '/assets/images/favicon.ico',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col surface-lowest">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
