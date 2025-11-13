import { NextResponse } from 'next/server'

// Cache the star count for 5 minutes
let cachedStars = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET() {
  try {
    const now = Date.now()

    // Return cached value if still valid
    if (cachedStars !== null && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json({
        stars: cachedStars,
        cached: true,
        source: 'cache'
      })
    }

    // Fetch from GitHub API
    const response = await fetch('https://api.github.com/repos/marketcalls/openalgo', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenAlgo-Website'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      // If GitHub API fails, return cached value if available
      if (cachedStars !== null) {
        return NextResponse.json({
          stars: cachedStars,
          cached: true,
          source: 'cache-fallback'
        })
      }
      throw new Error('Failed to fetch from GitHub API')
    }

    const data = await response.json()
    cachedStars = data.stargazers_count
    lastFetch = now

    return NextResponse.json({
      stars: cachedStars,
      cached: false,
      source: 'github-api'
    })
  } catch (error) {
    console.error('Error fetching GitHub stars:', error)

    // Return cached value if available, otherwise return a fallback
    if (cachedStars !== null) {
      return NextResponse.json({
        stars: cachedStars,
        cached: true,
        source: 'cache-error-fallback'
      })
    }

    // Return a reasonable fallback value
    return NextResponse.json({
      stars: null,
      error: 'Unable to fetch stars',
      source: 'error'
    }, { status: 200 }) // Return 200 to avoid breaking the UI
  }
}
