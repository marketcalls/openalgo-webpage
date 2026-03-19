"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, User, Clock, BookOpen, Rss } from "lucide-react"

async function fetchRSSFeed() {
  try {
    const response = await fetch('/api/blog-feed')
    if (!response.ok) throw new Error('Failed to fetch RSS feed')
    return await response.json()
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return { items: [] }
  }
}

function BlogCard({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const getReadingTime = (content) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return `${Math.ceil(words / 200)} min read`
  }

  const getBlogCategory = (categories) => {
    if (!categories || categories.length === 0) return 'General'
    return categories[0]
  }

  const category = getBlogCategory(post.categories)

  return (
    <article className="relative group obsidian-card rounded-xl p-6 hover-lift ghost-border flex flex-col h-full">
      <div className="inline-flex p-2.5 rounded-lg text-secondary bg-secondary/10 mb-4">
        <BookOpen className="h-5 w-5" />
      </div>

      <div className="text-xs text-on-surface-variant mb-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3" />
          <span className="font-label">By {post.author || 'OpenAlgo'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span className="font-label">{formatDate(post.pubDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span className="font-label">{getReadingTime(post.content)}</span>
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold mb-3 text-on-surface">{post.title}</h3>
      <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">{post.contentSnippet || (post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...')}</p>

      <div className="mt-auto">
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            Read More
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      <div className="absolute top-6 right-6">
        <span className="font-label text-label-sm px-2.5 py-1 rounded-full text-primary bg-primary/10">
          {category}
        </span>
      </div>
    </article>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const data = await fetchRSSFeed()
        setPosts(data.items || [])
      } catch (err) {
        setError('Failed to load blog posts')
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container max-w-7xl py-16">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full surface-container mx-auto mb-4 animate-pulse glow-primary" />
            <p className="text-on-surface-variant font-label">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container max-w-7xl py-16">
          <div className="text-center">
            <p className="text-destructive mb-5">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl py-16">
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-display-md text-on-surface">OpenAlgo Blog</h1>
            <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest insights, tutorials, and developments in algorithmic trading.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <BlogCard key={index} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-on-surface-variant mb-5">No blog posts found</p>
              <Button variant="outline" asChild>
                <a href="https://blog.openalgo.in" target="_blank" rel="noopener noreferrer">
                  Visit Blog Website
                </a>
              </Button>
            </div>
          )}

          <div className="text-center space-y-5">
            <p className="text-on-surface-variant">Want to stay updated with our latest posts?</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="https://blog.openalgo.in" target="_blank" rel="noopener noreferrer">
                  Visit Full Blog
                </a>
              </Button>
              <Button asChild>
                <a href="https://medium.com/feed/@openalgo" target="_blank" rel="noopener noreferrer">
                  <Rss className="w-4 h-4 mr-2" />
                  RSS Feed
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
