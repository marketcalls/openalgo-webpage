"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TrendingDown, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <TrendingDown className="h-32 w-32 text-primary animate-bounce" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-6xl font-bold">404</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Market Crash! Page Not Found</h1>
          <p className="text-xl text-muted-foreground">
            Looks like this trade didn't execute. The market makers must have moved the price!
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/faq">
              Need Help?
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
