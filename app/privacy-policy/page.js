import React from 'react';
import { Shield, Lock, Server, Database, Eye, UserX, Globe, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-14">
        <div className="inline-flex p-4 rounded-2xl surface-low ghost-border glow-tertiary mb-6">
          <Shield className="h-10 w-10 text-tertiary" />
        </div>
        <h1 className="text-display-md mb-4 text-on-surface">Privacy Policy</h1>
        <p className="text-lg text-on-surface-variant">
          Your Privacy is Absolute - We Collect Nothing
        </p>
        <p className="font-label text-label-md text-on-surface-variant mt-3">Last Updated: December 2024</p>
      </div>

      <div className="rounded-xl p-7 mb-10 ghost-border" style={{ background: 'hsl(var(--tertiary-container))' }}>
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-tertiary mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-on-surface mb-2">
              Zero Data Collection Policy
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              OpenAlgo and the OpenAlgo Web Portal do not collect, store, transmit, or process any user data whatsoever.
              There are no analytics, no telemetry, no tracking cookies, no user behavior monitoring, and no data collection
              of any kind.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Database className="h-5 w-5 mr-3 text-primary" />
            What We DON'T Collect
          </h2>
          <ul className="space-y-4">
            {[
              { label: "No Personal Information:", desc: "We don't collect names, emails, or any identifying information" },
              { label: "No Usage Data:", desc: "We don't track how you use the platform or what features you access" },
              { label: "No Trading Data:", desc: "Your strategies, trades, and financial information stay completely private" },
              { label: "No Analytics:", desc: "No Google Analytics, no tracking pixels, no third-party monitoring" },
              { label: "No Cookies:", desc: "We don't use tracking cookies or any form of browser storage for tracking" },
              { label: "No Server Logs:", desc: "We don't maintain logs of your activities or access patterns" },
            ].map(({ label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <UserX className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-on-surface-variant"><strong className="text-on-surface">{label}</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Server className="h-5 w-5 mr-3 text-primary" />
            Self-Hosted Architecture
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">
            OpenAlgo is designed to be self-hosted on your own infrastructure. This means:
          </p>
          <ul className="space-y-3">
            {[
              "All data remains on your servers under your complete control",
              "No data ever reaches our servers because we don't have any",
              "You own and control all aspects of your trading infrastructure",
              "Complete privacy and data sovereignty"
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-tertiary mt-0.5 flex-shrink-0" />
                <span className="text-on-surface-variant">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Lock className="h-5 w-5 mr-3 text-primary" />
            Your Data, Your Control
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">When you use OpenAlgo:</p>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              "Your API keys are stored locally in your browser or your self-hosted instance",
              "Trading data communicates directly between your instance and your broker",
              "Configuration and preferences remain on your local setup",
              "No intermediary servers or cloud services are involved"
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Eye className="h-5 w-5 mr-3 text-primary" />
            Transparency
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">
            OpenAlgo is fully open-source under the AGPL-3.0 license. You can:
          </p>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              "Audit the entire codebase on GitHub",
              "Verify that no data collection code exists",
              "Build and deploy from source for complete assurance",
              "Contribute to the project and help maintain privacy standards"
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Globe className="h-5 w-5 mr-3 text-primary" />
            Third-Party Services
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">This website (openalgo.in) may use:</p>
          <ul className="space-y-2 text-on-surface-variant">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Cloudflare for CDN and DDoS protection (see Cloudflare's privacy policy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>GitHub for hosting documentation and source code</span>
            </li>
          </ul>
          <p className="mt-5 font-label text-label-lg text-on-surface-variant">
            Note: The OpenAlgo application itself, when self-hosted, does not use any third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-headline-sm mb-4 text-on-surface">Changes to This Policy</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Our commitment to zero data collection is permanent. Any updates to this policy will only
            clarify or strengthen our privacy stance, never weaken it.
          </p>
        </section>

        <section>
          <h2 className="text-headline-sm mb-4 text-on-surface">Contact</h2>
          <p className="text-on-surface-variant mb-4">
            For questions about this privacy policy or OpenAlgo's privacy practices:
          </p>
          <ul className="space-y-2 text-on-surface-variant">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>GitHub: <a href="https://github.com/marketcalls/openalgo" className="text-primary hover:underline">github.com/marketcalls/openalgo</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Discord: <a href="/discord" className="text-primary hover:underline">Join our community</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Email: rajandran@openalgo.in</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-14 p-8 rounded-xl surface-low ghost-border text-center">
        <p className="text-lg font-semibold mb-2 text-on-surface">
          Privacy First, Always
        </p>
        <p className="text-on-surface-variant">
          OpenAlgo believes that your trading data is yours alone. We will never compromise on privacy.
        </p>
      </div>
    </div>
  );
}
