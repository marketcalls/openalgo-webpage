import { ImageResponse } from 'next/server'
import { OpenGraphImage } from '@/components/OpenGraphImage'

export const runtime = 'edge'

export async function GET() {
  try {
    const title = 'OpenAlgo - Your Personal Algo Trading Platform'
    const description = 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.'

    return await OpenGraphImage({ title, description })
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
