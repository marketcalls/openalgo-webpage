"use client"

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

export function GitHubStars() {
  const [stars, setStars] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch('/api/github-stars')
        const data = await response.json()

        if (data.stars !== null) {
          setStars(data.stars)
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [])

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null) return null
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs">
        <Star className="w-3 h-3" />
        <span>...</span>
      </div>
    )
  }

  if (stars === null) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs">
        <Star className="w-3 h-3" />
        <span>Star</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs font-medium">
      <Star className="w-3 h-3 fill-current" />
      <span>{formatNumber(stars)}</span>
    </div>
  )
}
