import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get("ip")
    
    if (!ip) {
      return NextResponse.json(
        { error: "IP address is required" },
        { status: 400 }
      )
    }
    
    // Fetch data from ip-api.com
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`,
      {
        headers: {
          "User-Agent": "OpenAlgo IP Tracker"
        }
      }
    )
    
    // Check for rate limiting
    if (response.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few minutes." },
        { status: 429 }
      )
    }
    
    const data = await response.json()
    
    // Add CORS headers for client-side requests
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
    }
    
    return NextResponse.json(data, { headers })
    
  } catch (error) {
    console.error("IP lookup error:", error)
    return NextResponse.json(
      { error: "Failed to fetch IP data" },
      { status: 500 }
    )
  }
}