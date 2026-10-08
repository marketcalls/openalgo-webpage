export const defaultMetadata = {
  metadataBase: new URL('https://openalgo.in'),
  title: {
    default: 'OpenAlgo - Open Source Trading Platform for Algo and Options Traders',
    template: '%s | OpenAlgo'
  },
  description: 'OpenAlgo is an open-source, self-hosted trading platform for algo, options and discretionary traders in Indian markets. Automate from TradingView, Amibroker or Python, build strategies with no code, trade options from the chain to multi-leg execution, and chart, scalp and test in Sandbox mode across 35+ brokers.',
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
    title: 'OpenAlgo - Open Source Trading Platform for Algo and Options Traders',
    description: 'OpenAlgo is an open-source, self-hosted trading platform for algo, options and discretionary traders in Indian markets. Automate from TradingView, Amibroker or Python, build strategies with no code, trade options from the chain to multi-leg execution, and chart, scalp and test in Sandbox mode across 35+ brokers.',
    siteName: 'OpenAlgo',
    images: [{
      url: 'https://openalgo.in/assets/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Open Source Trading Platform for Algo and Options Traders',
      type: 'image/png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAlgo - Open Source Trading Platform for Algo and Options Traders',
    description: 'OpenAlgo is an open-source, self-hosted trading platform for algo, options and discretionary traders in Indian markets. Automate from TradingView, Amibroker or Python, build strategies with no code, trade options from the chain to multi-leg execution, and chart, scalp and test in Sandbox mode across 35+ brokers.',
    images: {
      url: 'https://openalgo.in/assets/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'OpenAlgo - Open Source Trading Platform for Algo and Options Traders'
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
}
