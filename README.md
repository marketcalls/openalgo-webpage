# OpenAlgo Website

This is the official website for OpenAlgo - Your Personal Algo Trading Platform. Built with Next.js and modern web technologies, it provides a comprehensive interface for accessing OpenAlgo's features and documentation.

## About OpenAlgo

OpenAlgo is a powerful algorithmic trading platform designed for Indian markets. It provides seamless integration with multiple trading platforms and brokers, making it easier for traders to automate their strategies.

## Key Features

- **Broker Integration**
  - Access to 12+ Indian brokers
  - Unified API structure across all brokers
  - Common symbol format for seamless integration

- **Platform Support**
  - Amibroker integration
  - TradingView webhook support
  - Python scripting capabilities
  - MetaTrader compatibility
  - Google Spreadsheets integration

- **Advanced Trading Features**
  - SmartOrder functionality
  - Basket order support
  - Split order capabilities
  - API Analyzer for strategy testing
  - Real-time market data

- **Developer Tools**
  - 20+ simplified APIs
  - Account, Data, and Order API endpoints
  - Comprehensive documentation
  - AI-powered development with LLM models
  - Modern UI dashboards

- **Community & Support**
  - Active Discord community
  - Detailed tutorials and guides
  - Regular updates and improvements

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icon system
- [Vercel](https://vercel.com) - Deployment platform

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

- `app/`: Next.js app directory
  - `page.js`: Home page
  - `roadmap/`: Roadmap and future features
  - `components/`: UI components
- `components/`: Reusable React components
  - `ui/`: shadcn/ui components
  - `navbar.jsx`: Navigation component
- `lib/`: Utility functions and configurations
- `public/`: Static assets and images

## Development

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager
- Git

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Configure any required environment variables

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Resources

- [OpenAlgo Documentation](https://docs.openalgo.in)
- [API Reference](https://docs.openalgo.in/api)
- [Discord Community](https://discord.gg/openalgo)
- [GitHub Repository](https://github.com/marketcalls/openalgo)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Discord Community - [Join us](https://discord.gg/openalgo)
- Documentation - [docs.openalgo.in](https://docs.openalgo.in)
- GitHub - [marketcalls/openalgo](https://github.com/marketcalls/openalgo)
