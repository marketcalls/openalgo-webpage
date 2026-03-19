"use client"

import { useState, useEffect } from "react"
import { MapPin, Globe, Building2, Map, Copy, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IPTrackerPage() {
  const [ipAddress, setIpAddress] = useState("")
  const [ipData, setIpData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userIp, setUserIp] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        const ipResult = await ipResponse.json()
        setUserIp(ipResult.ip)
        setIpAddress(ipResult.ip)

        const locationResponse = await fetch(`/api/ip-lookup?ip=${ipResult.ip}`)
        const locationData = await locationResponse.json()
        if (locationData.status === "success") setIpData(locationData)
      } catch (err) {
        console.error("Error fetching initial data:", err)
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
      const response = await fetch(`/api/ip-lookup?ip=${ipAddress}`)
      if (response.status === 429) {
        setError("Rate limit exceeded. Please try again in a few minutes.")
        setLoading(false)
        return
      }
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch IP data")
        setIpData(null)
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
    } catch (err) {
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
    <div className="container max-w-7xl py-16">
      <div className="space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-display-md text-on-surface">IP Address & Location Tracker</h1>
          <p className="text-lg text-on-surface-variant">
            Discover your digital identity and geographic location
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl surface-low p-6 ghost-border">
              <h2 className="font-label text-label-md uppercase tracking-wider text-on-surface-variant mb-4">IPV4 ADDRESS</h2>
              <div className="space-y-4">
                <div className="text-display-sm font-mono text-primary">
                  {userIp || "Loading..."}
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Globe className="h-4 w-4" />
                  <span className="font-label text-label-md">Connected via IPv4</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Enter IP address to lookup"
                    className="w-full px-4 py-3 rounded-lg bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50 ghost-border transition-all focus:surface-container"
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                      </span>
                    ) : "Lookup IP"}
                  </Button>
                  <Button type="button" variant="outline" onClick={copyToClipboard} className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy IPv4"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="rounded-xl surface-low p-6 ghost-border">
              <h2 className="font-label text-label-md uppercase tracking-wider text-on-surface-variant mb-4">IPV6 ADDRESS</h2>
              <div className="space-y-4">
                <div className="text-lg font-mono text-destructive">Not Available</div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Globe className="h-4 w-4 text-destructive" />
                  <span className="font-label text-label-md">Not connected with IPv6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 rounded-xl surface-low p-6 ghost-border">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-on-surface">Geographic Location</h2>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl ghost-border flex items-center gap-2 text-destructive" style={{ background: 'hsl(var(--error-container))' }}>
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {ipData && ipData.status === "success" ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "COUNTRY", value: ipData.country },
                    { label: "REGION", value: ipData.regionName },
                    { label: "CITY", value: ipData.city },
                    { label: "ISP", value: ipData.isp },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</p>
                      <p className="font-medium text-on-surface">{value || "N/A"}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4">
                  {[
                    { label: "TIME ZONE", value: ipData.timezone },
                    { label: "COORDINATES", value: ipData.lat && ipData.lon ? `${ipData.lat}, ${ipData.lon}` : null },
                    { label: "AS NUMBER", value: ipData.as },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</p>
                      <p className="font-medium text-on-surface">{value || "N/A"}</p>
                    </div>
                  ))}
                  {ipData.proxy && (
                    <div>
                      <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">PROXY DETECTED</p>
                      <p className="font-medium text-primary">Yes</p>
                    </div>
                  )}
                  {ipData.mobile && (
                    <div>
                      <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">MOBILE CONNECTION</p>
                      <p className="font-medium text-secondary">Yes</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 relative h-64 rounded-xl overflow-hidden ghost-border">
                  <iframe
                    width="100%" height="100%"
                    style={{ border: 0 }} loading="lazy" allowFullScreen
                    src={`https://maps.google.com/maps?q=${ipData.lat},${ipData.lon}&z=10&output=embed`}
                  />
                  <div className="absolute bottom-2 right-2 glass-float px-2 py-1 rounded-lg text-xs">
                    <a
                      href={`https://maps.google.com/maps?q=${ipData.lat},${ipData.lon}&z=10`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Map className="h-3 w-3" /> View in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-on-surface-variant">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Enter an IP address to view location data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 text-on-surface">
            <Building2 className="h-5 w-5 text-primary" />
            Custom IP Lookup
          </h3>
          <p className="text-on-surface-variant">Track any IP address by entering it in the search box above</p>
        </div>
      </div>
    </div>
  )
}
