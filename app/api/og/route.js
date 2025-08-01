import { ImageResponse } from 'next/og'
import { OpenGraphImage } from '@/components/OpenGraphImage'

export const runtime = 'edge'

export async function GET() {
  try {
    const title = 'OpenAlgo - Your Personal Algo Trading Platform'
    const description = 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.'

    return await OpenGraphImage({ title, description })
  } catch (e) {
    console.error('OG Image generation failed:', e.message)
    
    // Redirect to static fallback image
    return Response.redirect('https://openalgo.in/assets/images/og-image.png', 302)
  }
}
