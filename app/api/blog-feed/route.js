import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://medium.com/feed/@openalgo', {
      headers: {
        'User-Agent': 'OpenAlgo-Website/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    
    // Parse RSS XML to JSON
    const posts = parseRSSFeed(xmlText)
    
    return NextResponse.json({
      items: posts,
      total: posts.length
    })
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed', items: [] },
      { status: 500 }
    )
  }
}

function parseRSSFeed(xmlText) {
  try {
    // Simple XML parsing for RSS feeds
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1]
      
      const description = extractTag(itemXml, 'description')
      const content = extractTag(itemXml, 'content:encoded') || description
      
      const post = {
        title: extractTag(itemXml, 'title'),
        link: extractTag(itemXml, 'link'),
        pubDate: extractTag(itemXml, 'pubDate'),
        author: extractTag(itemXml, 'dc:creator') || extractTag(itemXml, 'author') || 'OpenAlgo',
        content: content,
        contentSnippet: createContentSnippet(description),
        categories: extractCategories(itemXml),
        guid: extractTag(itemXml, 'guid')
      }
      
      items.push(post)
    }

    return items.slice(0, 12) // Limit to 12 most recent posts
  } catch (error) {
    console.error('Error parsing RSS feed:', error)
    return []
  }
}

function extractTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  if (!match) return ''
  
  let content = match[1].trim()
  
  // Handle CDATA sections
  if (content.includes('<![CDATA[')) {
    content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  }
  
  return content
}

function extractCategories(xml) {
  const categories = []
  const categoryRegex = /<category[^>]*>([^<]+)<\/category>/g
  let match

  while ((match = categoryRegex.exec(xml)) !== null) {
    categories.push(match[1].trim())
  }

  return categories
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

function createContentSnippet(description) {
  if (!description) return ''
  
  // Strip HTML and decode entities
  let snippet = stripHtml(description)
  
  // Remove common Medium artifacts
  snippet = snippet.replace(/^\d+ min read\s*/, '') // Remove "5 min read"
  snippet = snippet.replace(/^.*?\d{4}\s*/, '') // Remove date prefixes
  
  // Truncate and add ellipsis
  if (snippet.length > 200) {
    snippet = snippet.substring(0, 200).trim() + '...'
  }
  
  return snippet
}