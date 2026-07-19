"use client"

import { useEffect } from "react"
import { useI18n } from "@/components/i18n/LanguageProvider"

export default function DiscordRedirect() {
  const { t } = useI18n()
  const DISCORD_URL = "https://discord.com/invite/UPh7QPsNhP"

  useEffect(() => {
    window.location.href = DISCORD_URL
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-headline-md mb-4 text-on-surface">{t('disc.redirecting')}</h1>
        <p className="text-on-surface-variant">
          {t('disc.fallback')}{" "}
          <a href={DISCORD_URL} className="text-primary hover:underline">{t('disc.clickHere')}</a>
        </p>
      </div>
    </div>
  )
}
