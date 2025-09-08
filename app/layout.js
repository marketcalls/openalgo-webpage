import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar.jsx'
import { Footer } from '@/components/footer.jsx'
import { defaultMetadata } from './metadata'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
