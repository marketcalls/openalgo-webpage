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
      url: 'https://openalgo.in/api/og',
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
      url: 'https://openalgo.in/api/og',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Your Personal Algo Trading Platform'
    },
    creator: '@openalgo',
    site: '@openalgo'
  },
  alternates: {
    canonical: 'https://openalgo.in'
  },
  verification: {
    google: 'your-google-verification-code', // Add if you have one
  },
  other: {
    'og:url': 'https://openalgo.in',
    'og:image': 'https://openalgo.in/api/og',
    'og:image:secure_url': 'https://openalgo.in/api/og',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:type': 'website',
    'og:locale': 'en_US',
    'twitter:url': 'https://openalgo.in',
    'twitter:image': 'https://openalgo.in/api/og'
  }
}
