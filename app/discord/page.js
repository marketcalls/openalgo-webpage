"use client"

import { useEffect } from "react"

export default function DiscordRedirect() {
  const DISCORD_URL = "https://discord.com/invite/UPh7QPsNhP"

  useEffect(() => {
    window.location.href = DISCORD_URL
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-headline-md mb-4 text-on-surface">Redirecting to Discord...</h1>
        <p className="text-on-surface-variant">
          If you are not redirected automatically,{" "}
          <a href={DISCORD_URL} className="text-primary hover:underline">click here</a>
        </p>
      </div>
    </div>
  )
}
