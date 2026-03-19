"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 display */}
        <div className="relative mb-10">
          <div className="text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              404
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-48 h-48 rounded-full bg-primary blur-3xl" />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h1 className="text-headline-md text-on-surface">Page Not Found</h1>
          <p className="text-on-surface-variant leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/features">
              <Search className="mr-2 h-4 w-4" />
              Explore Features
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
