"use client"

import { useState, useEffect } from "react"
import { MapPin, Globe, Building2, Map, Copy, Loader2, AlertCircle } from "lucide-react"

export default function IPTrackerPage() {
  const [ipAddress, setIpAddress] = useState("")
  const [ipData, setIpData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userIp, setUserIp] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // Get user's IP and location on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First get the IP
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        const ipData = await ipResponse.json()
        setUserIp(ipData.ip)
        setIpAddress(ipData.ip)
        
        // Then get location data for user's IP
        const locationResponse = await fetch(`http://ip-api.com/json/${ipData.ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`)
        const locationData = await locationResponse.json()
        
        if (locationData.status === "success") {
          setIpData(locationData)
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }
    
    fetchUserData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ipAddress) return

    setLoading(true)
    setError("")
    
    try {
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`)
      
      if (response.status === 429) {
        setError("Rate limit exceeded. Please try again in a few minutes.")
        setLoading(false)
        return
      }
      
      const data = await response.json()
      
      if (data.status === "fail") {
        setError(data.message || "Invalid IP address or query failed")
        setIpData(null)
      } else {
        setIpData(data)
        setError("")
      }
    } catch (error) {
      console.error("Error fetching IP data:", error)
      setError("Failed to fetch IP data. Please try again.")
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ipAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container max-w-7xl py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">IP Address & Location Tracker</h1>
          <p className="text-xl text-muted-foreground">
            Discover your digital identity and geographic location!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - IP Address */}
          <div className="space-y-6">
            {/* IPv4 Address Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">IPV4 ADDRESS</h2>
              <div className="space-y-4">
                <div className="text-3xl font-mono font-bold text-primary">
                  {userIp || "Loading..."}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Connected via IPv4</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Enter IP address to lookup"
                    className="w-full px-4 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Lookup IP"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy IPv4"}
                  </button>
                </form>
              </div>
            </div>

            {/* IPv6 Address Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">IPV6 ADDRESS</h2>
              <div className="space-y-4">
                <div className="text-lg font-mono text-red-500">
                  Not Available
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-red-500" />
                  <span>Not connected with IPv6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Location Data */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Geographic Location</h2>
            </div>
            
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {ipData && ipData.status === "success" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">COUNTRY</p>
                    <p className="font-medium">{ipData.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">REGION</p>
                    <p className="font-medium">{ipData.regionName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CITY</p>
                    <p className="font-medium">{ipData.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ISP</p>
                    <p className="font-medium">{ipData.isp || "N/A"}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">TIME ZONE</p>
                    <p className="font-medium">{ipData.timezone || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">COORDINATES</p>
                    <p className="font-medium">
                      {ipData.lat && ipData.lon 
                        ? `${ipData.lat}, ${ipData.lon}` 
                        : "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">AS NUMBER</p>
                    <p className="font-medium">{ipData.as || "N/A"}</p>
                  </div>
                  
                  {ipData.proxy && (
                    <div>
                      <p className="text-sm text-muted-foreground">PROXY DETECTED</p>
                      <p className="font-medium text-orange-500">Yes</p>
                    </div>
                  )}
                  
                  {ipData.mobile && (
                    <div>
                      <p className="text-sm text-muted-foreground">MOBILE CONNECTION</p>
                      <p className="font-medium text-blue-500">Yes</p>
                    </div>
                  )}
                </div>

                {/* Google Maps Embed */}
                <div className="mt-6 relative h-64 rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${ipData.lat},${ipData.lon}&z=10&output=embed`}
                  />
                  <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs">
                    <a 
                      href={`https://maps.google.com/maps?q=${ipData.lat},${ipData.lon}&z=10`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Map className="h-3 w-3" />
                      View in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter an IP address to view location data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom IP Lookup Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Custom IP Lookup
          </h3>
          <p className="text-muted-foreground">
            Track any IP address by entering it in the search box above
          </p>
        </div>
      </div>
    </div>
  )
}