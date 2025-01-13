import { OpenGraphImage } from '@/components/OpenGraphImage'

export const runtime = 'edge'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'OpenAlgo - Your Personal Algo Trading Platform'
  const description = searchParams.get('description') || 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.'

  return OpenGraphImage({ title, description })
}
