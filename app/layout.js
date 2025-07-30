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
      <head>
        <script 
          async
          src="https://tqec4ynyoy2hfntmxkphpfwx.agents.do-ai.run/static/chatbot/widget.js"
          data-agent-id="5c0fa6aa-6d3b-11f0-bf8f-4e013e2ddde4"
          data-chatbot-id="JsoOFfwGxirwLCaT_zanNJ3TATcva_4p"
          data-name="OpenAlgo Expert Agent"
          data-primary-color="#031B4E"
          data-secondary-color="#E5E8ED"
          data-button-background-color="#031B4E"
          data-starting-message="Welcome to OpenAlgo Assistant. How can I help you make the most of the platform today?"
          data-logo="/static/chatbot/icons/default-agent.svg"
        ></script>
      </head>
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
