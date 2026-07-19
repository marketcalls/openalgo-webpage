"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import { Download, Laptop, Monitor, Terminal, ExternalLink, Github, Package, Chrome, FileSpreadsheet, GitBranch, BookOpen, Brain, Code2, Hexagon, Coffee, Hash, Wind, Plug, History, Zap, Layers, Bot, Smartphone, Globe, Puzzle, Gauge, TrendingUp } from "lucide-react"
import { useState } from "react"

const iconAccents = [
  { tile: "bg-primary/10", glyph: "text-primary" },
  { tile: "bg-secondary/10", glyph: "text-secondary" },
  { tile: "bg-tertiary/10", glyph: "text-tertiary" },
]

function ProjectIcon({ icon: Icon, index = 0 }) {
  const accent = iconAccents[index % iconAccents.length]
  return (
    <div className={`inline-flex p-2 rounded-lg ${accent.tile}`}>
      <Icon className={`h-5 w-5 ${accent.glyph}`} />
    </div>
  )
}

export default function DownloadPage() {
  const { t } = useI18n()
  const [activePlatform, setActivePlatform] = useState("mac")

  const sdks = [
    { title: "Python", icon: Code2, url: "https://github.com/marketcalls/openalgo-python-library", docs: "https://docs.openalgo.in/trading-platform/python" },
    { title: "Node.js", icon: Hexagon, url: "https://github.com/marketcalls/openalgo-node", docs: "https://docs.openalgo.in/trading-platform/nodejs" },
    { title: "Java", icon: Coffee, url: "https://github.com/marketcalls/openalgo-java", docs: "https://docs.openalgo.in/trading-platform/java" },
    { title: ".NET / C#", icon: Hash, url: "https://github.com/marketcalls/openalgo.NET", docs: "https://docs.openalgo.in/trading-platform/.net" },
    { title: "Go", icon: Wind, url: "https://github.com/marketcalls/openalgo-go", docs: "https://docs.openalgo.in/trading-platform/go" }
  ]

  const integrations = [
    { title: "Excel Add-in", icon: FileSpreadsheet, url: "https://github.com/marketcalls/OpenAlgo-Excel", docs: "https://docs.openalgo.in/trading-platform/excel" },
    { title: "Amibroker Plugin", icon: Plug, url: "https://github.com/marketcalls/OpenAlgoPlugin", docs: "https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" },
    { title: "Backtrader Integration", icon: History, url: "https://github.com/p2c2e/openalgo-backtrader" },
    { title: "PineTS", icon: Zap, url: "https://github.com/marketcalls/openalgo-pinets" },
    { title: "AlgoMirror", icon: Layers, url: "https://github.com/marketcalls/algomirror" },
    { title: "MCP / AI Agents", icon: Bot, url: "https://github.com/marketcalls/openalgo/tree/main/mcp", docs: "https://docs.openalgo.in/mcp" },
    { title: "OpenAlgo Mobile", icon: Smartphone, url: "https://github.com/marketcalls/openalgo-mobile" },
    { title: "Web Portal", icon: Globe, url: "https://github.com/marketcalls/openalgo-webpage" },
    { title: "Chrome Plugin", icon: Puzzle, url: "https://github.com/marketcalls/openalgo-chrome" },
    { title: "Fast Scalper", icon: Gauge, url: "https://github.com/marketcalls/fastscalper-tauri" },
    { title: "OpenBull", icon: TrendingUp, url: "https://github.com/marketcalls/openbull" }
  ]

  const platformTabs = [
    { id: "mac", label: "macOS", icon: Laptop },
    { id: "linux", label: "Linux", icon: Terminal },
    { id: "windows", label: "Windows", icon: Monitor },
  ]

  const downloads = {
    mac: [
      { platform: "Mac Universal", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_universal.dmg", label: t('dl.downloadFmt').replace('{x}', "DMG") },
      { platform: "Mac Universal (Portable)", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_universal_mac.zip", label: t('dl.downloadFmt').replace('{x}', "ZIP") },
    ],
    linux: [
      { platform: "Ubuntu / Debian", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_amd64.deb", label: t('dl.downloadFmt').replace('{x}', "DEB") },
      { platform: "Fedora / Red Hat", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper-0.1.0-1.x86_64.rpm", label: t('dl.downloadFmt').replace('{x}', "RPM") },
      { platform: "AppImage", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_amd64.AppImage", label: t('dl.downloadFmt').replace('{x}', "AppImage") },
    ],
    windows: [
      { platform: "Windows (MSI)", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_x64_en-US.msi", label: t('dl.downloadFmt').replace('{x}', "MSI") },
      { platform: "Windows (EXE)", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_x64-setup.exe", label: t('dl.downloadFmt').replace('{x}', "EXE") },
    ]
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-display-md text-center mb-14 text-on-surface">{t('dl.title')}</h1>

        {/* Mini FOSS Universe Section */}
        <div className="mb-20">
          <h2 className="text-display-sm mb-3 text-center text-on-surface">{t('dl.fossTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-6 max-w-3xl mx-auto">
            {t('dl.fossSub')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[t('dl.tag1'), t('dl.tag2'), t('dl.tag3'), t('dl.tag4')].map(tag => (
              <span key={tag} className="px-4 py-1.5 surface-low rounded-full font-label text-label-md text-on-surface-variant">{tag}</span>
            ))}
          </div>

          {/* Core Project */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-5 flex items-center justify-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">{t('dl.coreLabel')}</span>
            </h3>
            <div className="flex justify-center">
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer"
                 className="obsidian-card p-6 rounded-xl hover-lift group block max-w-lg ghost-border">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-on-surface">OpenAlgo Core</h4>
                  <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-on-surface-variant">{t('dl.coreDesc')}</p>
              </a>
            </div>
          </div>

          {/* SDKs */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">{t('dl.sdkLabel')}</span>
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              {t('dl.sdkDescPre')} <strong className="text-on-surface">API v1</strong> {t('dl.sdkDescPost')}
            </p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {sdks.map((sdk, index) => (
                <div key={index} className="obsidian-card p-5 rounded-xl hover-lift group ghost-border relative">
                  <a href={sdk.url} target="_blank" rel="noopener noreferrer"
                     className="absolute inset-0 rounded-xl" aria-label={sdk.title} />
                  <div className="flex items-start justify-between mb-3">
                    <ProjectIcon icon={sdk.icon} index={index} />
                    <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-semibold mb-1 text-on-surface">{sdk.title}</h4>
                  {sdk.docs && (
                    <a href={sdk.docs} target="_blank" rel="noopener noreferrer"
                       className="relative z-10 text-xs text-primary hover:underline font-label">
                      {t('dl.viewDocs')} &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Libraries */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">{t('dl.intLabel')}</span>
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              {t('dl.intDesc')}
            </p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {integrations.map((item, index) => (
                <div key={index} className="obsidian-card p-5 rounded-xl hover-lift group ghost-border relative">
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                     className="absolute inset-0 rounded-xl" aria-label={item.title} />
                  <div className="flex items-start justify-between mb-3">
                    <ProjectIcon icon={item.icon} index={index} />
                    <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-on-surface">{item.title}</h4>
                  {item.docs && (
                    <a href={item.docs} target="_blank" rel="noopener noreferrer"
                       className="relative z-10 text-xs text-primary hover:underline font-label">
                      {t('dl.viewDocs')} &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div className="mb-12 p-8 rounded-xl surface-low ghost-border">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-on-surface">{t('dl.docsTitle')}</span>
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              {t('dl.docsDesc')}
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Code2, name: "Python", url: "https://docs.openalgo.in/trading-platform/python" },
                { icon: Hexagon, name: "Node.js", url: "https://docs.openalgo.in/trading-platform/nodejs" },
                { icon: Coffee, name: "Java", url: "https://docs.openalgo.in/trading-platform/java" },
                { icon: Hash, name: ".NET", url: "https://docs.openalgo.in/trading-platform/.net" },
                { icon: Wind, name: "Go", url: "https://docs.openalgo.in/trading-platform/go" },
                { icon: FileSpreadsheet, name: "Excel", url: "https://docs.openalgo.in/trading-platform/excel" },
                { icon: Plug, name: "Amibroker", url: "https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" },
                { icon: Bot, name: "MCP / AI", url: "https://docs.openalgo.in/mcp" },
              ].map(({ icon: Icon, name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2 font-label">
                  <Icon className="h-4 w-4" /> {t('dl.docsLinkLabel').replace('{x}', name)}
                </a>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="text-center p-8 rounded-xl surface-low ghost-border relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-secondary/5 to-tertiary/5" />
            <div className="relative z-10">
              <p className="text-on-surface-variant mb-5 max-w-2xl mx-auto">
                {t('dl.philLead')} <strong className="text-on-surface">{t('dl.philStrong')}</strong>
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('dl.exploreGithub')}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-16 p-8 rounded-xl surface-container ghost-border">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-on-surface">
            <ExternalLink className="h-5 w-5 mr-2 text-primary" />
            {t('dl.reqTitle')}
          </h3>
          <p className="text-on-surface mb-4">
            <strong>{t('dl.reqLead')}</strong>
          </p>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              t('dl.req1'),
              t('dl.req2'),
              t('dl.req3'),
              t('dl.req4')
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-on-surface-variant">
            {t('dl.reqNote')}
          </p>
        </div>

        {/* FastScalper Section */}
        <div className="mb-16">
          <h2 className="text-display-sm text-center mb-10 text-on-surface">
            FastScalper <span className="text-primary">{t('dl.fsDesktop')}</span>
          </h2>

          <div className="rounded-xl surface-low p-8 ghost-border">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-headline-sm text-on-surface">{t('dl.fsAvailable')}</h3>
              <span className="font-label text-label-md px-3 py-1.5 rounded-full surface-container text-on-surface-variant">
                {t('dl.versionLabel').replace('{n}', "0.1.0")}
              </span>
            </div>

            {/* Platform Tabs */}
            <div className="flex gap-2 mb-8 surface-container p-1.5 rounded-xl w-fit">
              {platformTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`flex items-center px-5 py-2.5 rounded-lg font-label text-label-lg transition-all ${
                    activePlatform === id
                      ? "surface-high text-on-surface ambient-shadow"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  onClick={() => setActivePlatform(id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>

            {/* Download Items */}
            <div className="space-y-3">
              {downloads[activePlatform].map(({ platform, version, url, label }) => (
                <div key={platform} className="flex items-center justify-between p-4 rounded-xl surface-container">
                  <div className="flex items-center gap-4">
                    <span className="text-on-surface font-medium">{platform}</span>
                    <span className="font-label text-label-md text-on-surface-variant">{version}</span>
                  </div>
                  <Button size="sm" asChild>
                    <a href={url}>{label}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* FastScalper Features */}
          <div className="mt-12">
            <h3 className="text-headline-md mb-8 text-on-surface">{t('dl.fsFeatures')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: t('dl.fsF1t'), items: [t('dl.fsF1i1'), t('dl.fsF1i2'), t('dl.fsF1i3')] },
                { title: t('dl.fsF2t'), items: [t('dl.fsF2i1'), t('dl.fsF2i2'), t('dl.fsF2i3')] },
                { title: t('dl.fsF3t'), items: [t('dl.fsF3i1'), t('dl.fsF3i2'), t('dl.fsF3i3')] },
                { title: t('dl.fsF4t'), items: [t('dl.fsF4i1'), t('dl.fsF4i2'), t('dl.fsF4i3')] },
              ].map(({ title, items }) => (
                <div key={title} className="obsidian-card p-6 rounded-xl ghost-border">
                  <h4 className="text-lg font-semibold mb-4 text-on-surface">{title}</h4>
                  <ul className="space-y-2 text-on-surface-variant">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg" asChild>
                <a href="/fastscalper">{t('dl.fsLearnMore')}</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Chrome Plugin Section */}
        <div className="mb-16">
          <h2 className="text-display-sm text-center mb-10 text-on-surface">
            <Chrome className="inline h-8 w-8 mr-3 text-primary" />
            {t('dl.chromeTitle')}
          </h2>

          <div className="rounded-xl surface-low p-8 ghost-border">
            <div className="grid md:grid-cols-7 gap-10">
              <div className="md:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">{t('dl.chromeAbout')}</h3>
                <p className="text-on-surface-variant mb-5 leading-relaxed">
                  {t('dl.chromeDesc')}
                </p>
                <ul className="space-y-2 text-on-surface-variant">
                  {[t('dl.chromeB1'), t('dl.chromeB2'), t('dl.chromeB3'), t('dl.chromeB4')].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">{t('dl.chromeDlTitle')}</h3>
                <div className="space-y-5">
                  <div className="p-5 rounded-xl surface-container">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-label-lg text-on-surface">{t('dl.versionLabel').replace('{n}', "1.0")}</span>
                      <span className="font-label text-label-md text-tertiary">{t('dl.latest')}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="https://github.com/marketcalls/openalgo-chrome/releases/tag/v1.0" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {t('dl.chromeDlBtn')}
                      </a>
                    </Button>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    <p className="mb-2 font-label text-label-lg text-on-surface">{t('dl.chromeStepsTitle')}</p>
                    <ol className="list-decimal list-inside space-y-1.5">
                      <li>{t('dl.chromeS1')}</li>
                      <li>{t('dl.chromeS2')}</li>
                      <li>{t('dl.chromeS3')}</li>
                      <li>{t('dl.chromeS4')}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Excel Add-in Section */}
        <div>
          <h2 className="text-display-sm text-center mb-10 text-on-surface">
            <FileSpreadsheet className="inline h-8 w-8 mr-3 text-primary" />
            {t('dl.excelTitle')}
          </h2>

          <div className="rounded-xl surface-low p-8 ghost-border">
            <div className="grid md:grid-cols-7 gap-10">
              <div className="md:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">{t('dl.excelAbout')}</h3>
                <p className="text-on-surface-variant mb-5 leading-relaxed">
                  {t('dl.excelDesc')}
                </p>
                <ul className="space-y-2 text-on-surface-variant">
                  {[t('dl.excelB1'), t('dl.excelB2'), t('dl.excelB3'), t('dl.excelB4'), t('dl.excelB5')].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">{t('dl.excelDlTitle')}</h3>
                <div className="space-y-5">
                  <div className="p-5 rounded-xl surface-container">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-label-lg text-on-surface">{t('dl.versionLabel').replace('{n}', "1.0.1")}</span>
                      <span className="font-label text-label-md text-tertiary">{t('dl.latest')}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="https://github.com/marketcalls/OpenAlgo-Excel/releases/tag/v1.0.1" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {t('dl.excelDlBtn')}
                      </a>
                    </Button>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    <p className="mb-2 font-label text-label-lg text-on-surface">{t('dl.excelReqTitle')}</p>
                    <ul className="space-y-1.5">
                      {[t('dl.excelR1'), t('dl.excelR2'), t('dl.excelR3'), t('dl.excelR4')].map(item => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
