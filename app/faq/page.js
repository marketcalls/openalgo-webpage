"use client"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MessageCircle, Github, BookOpen } from "lucide-react"
import { ExternalLink } from "lucide-react"

// FAQ data
const faqs = [
  {
    question: "What is OpenAlgo?",
    answer: "OpenAlgo is an open-source algorithmic trading platform that acts as a bridge between various trading platforms and brokers. It's a web-based, self-hostable application that can run on Windows, Mac, Linux, or cloud environments. OpenAlgo currently supports connecting to your personal trading account and can interact with multiple popular trading platforms like Amibroker, MetaTrader, Python, NodeJS, Excel, and Google Spreadsheet."
  },
  {
    question: "Which brokers are supported?",
    answer: `OpenAlgo currently supports integration with the following popular brokers in the Indian market:

• 5paisa
• 5paisa (XTS)
• Angel One
• Aliceblue
• Compositedge
• Dhan
• Firstock
• Flattrade
• Fyers
• Kotak
• PayTM
• ICICI Direct
• IIFL (XTS)
• Jainam (XTS)
• Shoonya
• Upstox
• Zebu
• Zerodha

And more brokers are being added regularly.`
  },
  {
    question: "What are the system requirements?",
    answer: `The minimum requirements are:

• 2GB RAM minimum
• Stable internet connection
• Python 3.10 or higher
• Any modern operating system (Windows, Mac, or Linux)`
  },
  {
    question: "Where can I host OpenAlgo?",
    answer: `OpenAlgo can be hosted in multiple environments:

• Locally on your Windows PC, Mac, or Linux machine
• On cloud servers (AWS, Digital Ocean, etc.)
• On your own private domain

For best performance with Indian markets, it's recommended to host on servers located in India to minimize latency.`
  },
  {
    question: "What are the costs involved?",
    answer: `OpenAlgo itself is completely free and open-source. However, there may be associated costs:

• Trading platform costs (if using TradingView, Amibroker, etc.)
• Broker API charges (varies by broker, many are free)
• Real-time data feed subscription
• Server hosting costs (if using cloud servers, typically $6-12/month for basic setups)
• Standard trading costs (brokerage, STT, GST, etc.)`
  },
  {
    question: "How secure is OpenAlgo?",
    answer: `OpenAlgo prioritizes security with features like:

• Self-hosted environment - you control your infrastructure
• Support for broker-specific security requirements (TOTP, 2FA)
• Secure storage of API keys and credentials
• Regular security updates and improvements
• Open-source code that can be audited for security`
  }
]

// Resource links
const resources = [
  {
    title: "Documentation",
    description: "Read the docs",
    icon: BookOpen,
    url: "https://docs.openalgo.in"
  },
  {
    title: "Discord Community",
    description: "Join our trading community",
    icon: MessageCircle,
    url: "/discord"
  },
  {
    title: "GitHub",
    description: "View the source code",
    icon: Github,
    url: "https://github.com/marketcalls/openalgo"
  }
]

export default function FAQPage() {
  return (
    <div className="container max-w-5xl py-12">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Common questions about OpenAlgo platform and its features
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </a>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? Join our Discord community
          </p>
          <Button asChild>
            <a href="/discord" target="_blank" rel="noopener noreferrer">
              Join Discord
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
