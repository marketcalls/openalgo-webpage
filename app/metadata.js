export const defaultMetadata = {
  metadataBase: new URL('https://openalgo.in'),
  title: {
    default: 'OpenAlgo - Your Personal Algo Trading Platform',
    template: '%s | OpenAlgo'
  },
  description: 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.',
  keywords: ['algo trading', 'algorithmic trading', 'trading platform', 'Indian markets', 'Amibroker', 'TradingView', 'Python trading'],
  authors: [{ name: 'OpenAlgo' }],
  creator: 'OpenAlgo',
  publisher: 'OpenAlgo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openalgo.in',
    title: 'OpenAlgo - Your Personal Algo Trading Platform',
    description: 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.',
    siteName: 'OpenAlgo',
    images: [{
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Your Personal Algo Trading Platform',
      type: 'image/png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAlgo - Your Personal Algo Trading Platform',
    description: 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.',
    images: {
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Your Personal Algo Trading Platform'
    },
    creator: '@openalgo',
    site: '@openalgo'
  },
  facebook: {
    appId: '', // Add your Facebook App ID if you have one
    type: 'website',
    title: 'OpenAlgo - Your Personal Algo Trading Platform',
    description: 'OpenAlgo is a powerful algorithmic trading platform for Indian markets, offering seamless integration with multiple trading platforms and brokers.',
    images: [{
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Your Personal Algo Trading Platform'
    }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'twitter:card': 'summary_large_image',
    'twitter:image': 'https://openalgo.in/api/og',
    'twitter:image:type': 'image/png',
    'twitter:image:width': '1200',
    'twitter:image:height': '630'
  }
}
