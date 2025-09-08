import React from 'react';
import { Shield, Lock, Server, Database, Eye, UserX, Globe, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 rounded-full bg-green-500/10 mb-4">
          <Shield className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Your Privacy is Absolute - We Collect Nothing
        </p>
        <p className="text-sm text-gray-600 mt-2">Last Updated: December 2024</p>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
              Zero Data Collection Policy
            </h2>
            <p className="text-green-700 dark:text-green-300">
              OpenAlgo and the OpenAlgo Web Portal do not collect, store, transmit, or process any user data whatsoever. 
              There are no analytics, no telemetry, no tracking cookies, no user behavior monitoring, and no data collection 
              of any kind.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Database className="h-6 w-6 mr-2 text-primary" />
            What We DON'T Collect
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <UserX className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
              <span><strong>No Personal Information:</strong> We don't collect names, emails, or any identifying information</span>
            </li>
            <li className="flex items-start">
              <UserX className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
              <span><strong>No Usage Data:</strong> We don't track how you use the platform or what features you access</span>
            </li>
            <li className="flex items-start">
              <UserX className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
              <span><strong>No Trading Data:</strong> Your strategies, trades, and financial information stay completely private</span>
            </li>
            <li className="flex items-start">
              <UserX className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
              <span><strong>No Analytics:</strong> No Google Analytics, no tracking pixels, no third-party monitoring</span>
            </li>
            <li className="flex items-start">
              <UserX className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
              <span><strong>No Cookies:</strong> We don't use tracking cookies or any form of browser storage for tracking</span>
            </li>
            <li className="flex items-start">
              <UserX className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
              <span><strong>No Server Logs:</strong> We don't maintain logs of your activities or access patterns</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Server className="h-6 w-6 mr-2 text-primary" />
            Self-Hosted Architecture
          </h2>
          <p className="mb-4">
            OpenAlgo is designed to be self-hosted on your own infrastructure. This means:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
              <span>All data remains on your servers under your complete control</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
              <span>No data ever reaches our servers because we don't have any</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
              <span>You own and control all aspects of your trading infrastructure</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
              <span>Complete privacy and data sovereignty</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Lock className="h-6 w-6 mr-2 text-primary" />
            Your Data, Your Control
          </h2>
          <p className="mb-4">
            When you use OpenAlgo:
          </p>
          <ul className="space-y-2 ml-6">
            <li>• Your API keys are stored locally in your browser or your self-hosted instance</li>
            <li>• Trading data communicates directly between your instance and your broker</li>
            <li>• Configuration and preferences remain on your local setup</li>
            <li>• No intermediary servers or cloud services are involved</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Eye className="h-6 w-6 mr-2 text-primary" />
            Transparency
          </h2>
          <p className="mb-4">
            OpenAlgo is fully open-source under the AGPL-3.0 license. You can:
          </p>
          <ul className="space-y-2 ml-6">
            <li>• Audit the entire codebase on GitHub</li>
            <li>• Verify that no data collection code exists</li>
            <li>• Build and deploy from source for complete assurance</li>
            <li>• Contribute to the project and help maintain privacy standards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Globe className="h-6 w-6 mr-2 text-primary" />
            Third-Party Services
          </h2>
          <p className="mb-4">
            This website (openalgo.in) may use:
          </p>
          <ul className="space-y-2 ml-6">
            <li>• Cloudflare for CDN and DDoS protection (see Cloudflare's privacy policy)</li>
            <li>• GitHub for hosting documentation and source code</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: The OpenAlgo application itself, when self-hosted, does not use any third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="mb-4">
            Our commitment to zero data collection is permanent. Any updates to this policy will only 
            clarify or strengthen our privacy stance, never weaken it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="mb-4">
            For questions about this privacy policy or OpenAlgo's privacy practices:
          </p>
          <ul className="space-y-2 ml-6">
            <li>• GitHub: <a href="https://github.com/marketcalls/openalgo" className="text-primary hover:underline">github.com/marketcalls/openalgo</a></li>
            <li>• Discord: <a href="/discord" className="text-primary hover:underline">Join our community</a></li>
            <li>• Email: rajandran@openalgo.in</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg text-center">
        <p className="text-lg font-semibold mb-2">
          🛡️ Privacy First, Always
        </p>
        <p className="text-muted-foreground">
          OpenAlgo believes that your trading data is yours alone. We will never compromise on privacy.
        </p>
      </div>
    </div>
  );
}