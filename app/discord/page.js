"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DiscordRedirect() {
  const router = useRouter()
  const DISCORD_URL = "https://discord.com/invite/UPh7QPsNhP"

  useEffect(() => {
    window.location.href = DISCORD_URL
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Discord...</h1>
        <p className="text-muted-foreground">
          If you are not redirected automatically,{" "}
          <a href={DISCORD_URL} className="text-primary hover:underline">
            click here
          </a>
        </p>
      </div>
    </div>
  )
}
