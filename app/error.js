'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-8 px-4">
        <div className="inline-flex p-4 rounded-2xl surface-low ghost-border glow-primary">
          <AlertTriangle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-display-sm text-on-surface">Too Many Requests</h1>
        <div className="space-y-3">
          <p className="text-lg text-on-surface-variant">
            You've reached the rate limit. Please try again later.
          </p>
          <p className="font-label text-label-md text-on-surface-variant">
            To protect our services, we limit each user to 200 requests per hour.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}
