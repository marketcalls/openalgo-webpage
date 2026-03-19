import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar.jsx'
import { Footer } from '@/components/footer.jsx'
import { defaultMetadata } from './metadata'
import './globals.css'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col surface-lowest">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
