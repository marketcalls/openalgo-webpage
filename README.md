# OpenAlgo Website

The official website for [OpenAlgo](https://openalgo.in) - India's first community-driven, open-source algorithmic trading platform. Built with Next.js 15 and React 19, this site serves as the primary landing page, documentation hub, and download portal for the OpenAlgo ecosystem.

## About OpenAlgo

OpenAlgo is a self-hostable algorithmic trading platform built by traders, for traders. It offers seamless integration with 30+ Indian brokers through a unified API, enabling automation from platforms like TradingView, Amibroker, Python, Excel, MetaTrader, and more. Deploy it on your own server - your strategies, your data, your infrastructure.

## Key Features

- **30+ Broker Integrations** - Unified API across all major Indian brokers with a common symbol format
- **16+ Platform Integrations** - Amibroker, TradingView, Python, MetaTrader, Excel, Chrome Extension, and more
- **6 Official SDKs** - Python, Node.js, Java, .NET/C#, Go, Rust
- **Self-Hosted & Private** - Deploy on your own infrastructure with complete data privacy
- **SmartOrder & Basket Orders** - Advanced order types including split orders and position management
- **AI/LLM Integration** - MCP (Model Context Protocol) support for AI-driven trading
- **FastScalper** - High-performance trading app built with Rust + Tauri
- **100% Open Source** - AGPL-3.0 licensed, community-driven, transparent development
- **Static IP Compliant** - SEBI-compliant static IP deployment guides included

## Website Pages

| Page | Description |
|------|-------------|
| `/` | Hero landing page with stats, ecosystem overview, and trust indicators |
| `/features` | 45+ features organized by category |
| `/getting-started` | Step-by-step beginner's guide |
| `/download` | Multi-platform downloads (macOS, Linux, Windows) and SDK links |
| `/roadmap` | Development roadmap with planned features |
| `/faq` | Frequently asked questions |
| `/blog` | News and updates |
| `/static-ip` | Static IP & VPS hosting guide for SEBI compliance |
| `/fastscalper` | FastScalper desktop trading app showcase |
| `/wabridge` | WhatsApp HTTP Bridge documentation |

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework (App Router)
- [React 19](https://react.dev/) - UI library
- [TailwindCSS 3.4](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Lucide Icons](https://lucide.dev/) - Icon system
- [Three.js](https://threejs.org/) + React Three Fiber - 3D graphics
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark/light mode
- [Vercel](https://vercel.com) - Deployment (Mumbai region)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/marketcalls/openalgo-webpage.git
cd openalgo-webpage
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                    # Next.js App Router pages
  api/                  # API routes (blog-feed, ip-lookup, OG image)
  blog/                 # Blog section
  download/             # Downloads page
  faq/                  # FAQ page
  fastscalper/          # FastScalper showcase
  features/             # Features listing
  getting-started/      # Beginner's guide
  roadmap/              # Development roadmap
  static-ip/            # Static IP hosting guide
  wabridge/             # WhatsApp Bridge docs
  layout.js             # Root layout
  page.js               # Home page
  metadata.js           # SEO metadata
  globals.css           # Global styles & design tokens
components/             # Reusable React components
  ui/                   # shadcn/ui components
  navbar.jsx            # Navigation
  footer.jsx            # Footer
  theme-provider.jsx    # Theme management
lib/                    # Utility functions
public/                 # Static assets, favicons, sitemap
middleware.js           # Rate limiting (200 req/hr per IP)
```

## Development

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Lint
```bash
npm run lint
```

## OpenAlgo Ecosystem

This website showcases the broader OpenAlgo FOSS ecosystem:

- **Core**: [OpenAlgo](https://github.com/marketcalls/openalgo) - Central API and trading engine
- **SDKs**: Python, Node.js, Java, .NET, Go, Rust
- **Apps**: FastScalper, OpenAlgo Mobile (Flutter), Chrome Extension, Excel Add-in
- **Tools**: AlgoMirror, OpenAlgo Flow, Historify, OpenQuest, OpenAlgo Chart
- **AI**: MCP integration for AI agents and LLM-powered trading

## Resources

- [OpenAlgo Documentation](https://docs.openalgo.in)
- [API Reference](https://docs.openalgo.in/api)
- [Discord Community](https://discord.gg/openalgo)
- [GitHub - OpenAlgo Core](https://github.com/marketcalls/openalgo)
- [GitHub - This Website](https://github.com/marketcalls/openalgo-webpage)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
