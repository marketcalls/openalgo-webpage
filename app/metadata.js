export const defaultMetadata = {
  metadataBase: new URL('https://openalgo.in'),
  title: {
    default: 'OpenAlgo - Algo Trading, Options Analytics & Execution Platform',
    template: '%s | OpenAlgo'
  },
  description: 'OpenAlgo is a self-hosted algo trading and options analytics platform for Indian markets. Strategy builder, option chain, Greeks, OI, vol surface, GEX, and one-click basket execution across 30+ brokers.',
  keywords: ['algo trading', 'algorithmic trading', 'options analytics', 'options trading', 'strategy builder', 'option chain', 'Greeks', 'open interest', 'max pain', 'vol surface', 'GEX', 'trading platform', 'Indian markets', 'Amibroker', 'TradingView', 'Python trading'],
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
    title: 'OpenAlgo - Algo Trading, Options Analytics & Execution Platform',
    description: 'OpenAlgo is a self-hosted algo trading and options analytics platform for Indian markets. Strategy builder, option chain, Greeks, OI, vol surface, GEX, and one-click basket execution across 30+ brokers.',
    siteName: 'OpenAlgo',
    images: [{
      url: 'https://openalgo.in/assets/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Algo Trading, Options Analytics & Execution Platform',
      type: 'image/png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAlgo - Algo Trading, Options Analytics & Execution Platform',
    description: 'OpenAlgo is a self-hosted algo trading and options analytics platform for Indian markets. Strategy builder, option chain, Greeks, OI, vol surface, GEX, and one-click basket execution across 30+ brokers.',
    images: {
      url: 'https://openalgo.in/assets/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Algo Trading, Options Analytics & Execution Platform'
    },
    creator: '@openalgoHQ',
    site: '@openalgoHQ'
  },
  alternates: {
    canonical: 'https://openalgo.in'
  },
  verification: {
    google: 'your-google-verification-code', // Add if you have one
  },
  other: {
    'og:url': 'https://openalgo.in',
    'og:image': 'https://openalgo.in/assets/images/og-image.png',
    'og:image:secure_url': 'https://openalgo.in/assets/images/og-image.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:type': 'website',
    'og:locale': 'en_US',
    'twitter:url': 'https://openalgo.in',
    'twitter:image': 'https://openalgo.in/assets/images/og-image.png'
  }
}
