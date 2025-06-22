"use client"

import { useState, useEffect } from 'react'
import { metadata as blogMetadata } from './metadata'
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, User, Clock, BookOpen, Rss, Tag } from "lucide-react"

async function fetchRSSFeed() {
  try {
    const response = await fetch('/api/blog-feed')
    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return { items: [] }
  }
}

function BlogCard({ post, index }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const getBlogCategory = (categories) => {
    if (!categories || categories.length === 0) return 'General'
    return categories[0]
  }

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Trading': 'bg-orange-500/10 text-orange-500',
      'Tutorial': 'bg-blue-500/10 text-blue-500', 
      'Analysis': 'bg-green-500/10 text-green-500',
      'Development': 'bg-purple-500/10 text-purple-500',
      'News': 'bg-pink-500/10 text-pink-500',
      'General': 'bg-blue-500/10 text-blue-500'
    }
    return categoryColors[category] || 'bg-blue-500/10 text-blue-500'
  }

  const category = getBlogCategory(post.categories)
  const categoryColor = getCategoryColor(category)

  return (
    <article className="relative group rounded-lg border p-6 hover:shadow-md transition-all bg-card flex flex-col h-full">
      <div className={`inline-flex p-2 rounded-lg ${categoryColor} mb-4`}>
        <BookOpen className="h-6 w-6" />
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1 mb-1">
          <User className="w-3 h-3" />
          <span>By {post.author || 'OpenAlgo'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.pubDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getReadingTime(post.content)}</span>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      
      <p className="text-muted-foreground mb-4">{post.contentSnippet || (post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...')}</p>
      
      <div className="mt-auto">
        <Button variant="outline" size="sm" asChild className="w-full">
          <a 
            href={post.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Read More
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
      
      <div className="absolute top-8 right-8">
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColor}`}>
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
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-12">
        <div className="space-y-8">
        {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">OpenAlgo Blog</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest insights, tutorials, and developments in algorithmic trading.
            </p>
          </div>

        {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <BlogCard key={index} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <Button variant="outline" asChild>
                <a 
                  href="https://blog.openalgo.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Blog Website
                </a>
              </Button>
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Want to stay updated with our latest posts?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a 
                  href="https://blog.openalgo.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Full Blog
                </a>
              </Button>
              <Button asChild>
                <a 
                  href="https://medium.com/feed/@openalgo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
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