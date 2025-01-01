'use client'
 
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
        <h1 className="text-4xl font-bold">Too Many Requests</h1>
        <div className="space-y-2">
          <p className="text-xl text-muted-foreground">
            You've reached the rate limit. Please try again later.
          </p>
          <p className="text-sm text-muted-foreground">
            To protect our services, we limit each user to 200 requests per hour.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="default"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}
