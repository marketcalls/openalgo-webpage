"use client"

import React from 'react';
import { Shield, Lock, Server, Database, Eye, UserX, Globe, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function PrivacyPolicy() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-14">
        <div className="inline-flex p-4 rounded-2xl surface-low ghost-border glow-tertiary mb-6">
          <Shield className="h-10 w-10 text-tertiary" />
        </div>
        <h1 className="text-display-md mb-4 text-on-surface">{t('priv.title')}</h1>
        <p className="text-lg text-on-surface-variant">
          {t('priv.subtitle')}
        </p>
        <p className="font-label text-label-md text-on-surface-variant mt-3">{t('priv.updated')}</p>
      </div>

      <div className="rounded-xl p-7 mb-10 ghost-border" style={{ background: 'hsl(var(--tertiary-container))' }}>
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-tertiary mt-0.5 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-on-surface mb-2">
              {t('priv.zero.title')}
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              {t('priv.zero.body')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Database className="h-5 w-5 mr-3 text-primary" />
            {t('priv.dont.title')}
          </h2>
          <ul className="space-y-4">
            {[
              { label: t('priv.dont.i1l'), desc: t('priv.dont.i1d') },
              { label: t('priv.dont.i2l'), desc: t('priv.dont.i2d') },
              { label: t('priv.dont.i3l'), desc: t('priv.dont.i3d') },
              { label: t('priv.dont.i4l'), desc: t('priv.dont.i4d') },
              { label: t('priv.dont.i5l'), desc: t('priv.dont.i5d') },
              { label: t('priv.dont.i6l'), desc: t('priv.dont.i6d') },
            ].map(({ label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <UserX className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <span className="text-on-surface-variant"><strong className="text-on-surface">{label}</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Server className="h-5 w-5 mr-3 text-primary" />
            {t('priv.self.title')}
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">
            {t('priv.self.intro')}
          </p>
          <ul className="space-y-3">
            {[
              t('priv.self.i1'),
              t('priv.self.i2'),
              t('priv.self.i3'),
              t('priv.self.i4'),
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-tertiary mt-0.5 shrink-0" />
                <span className="text-on-surface-variant">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Lock className="h-5 w-5 mr-3 text-primary" />
            {t('priv.control.title')}
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">{t('priv.control.intro')}</p>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              t('priv.control.i1'),
              t('priv.control.i2'),
              t('priv.control.i3'),
              t('priv.control.i4'),
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Eye className="h-5 w-5 mr-3 text-primary" />
            {t('priv.trans.title')}
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">
            {t('priv.trans.intro')}
          </p>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              t('priv.trans.i1'),
              t('priv.trans.i2'),
              t('priv.trans.i3'),
              t('priv.trans.i4'),
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-headline-sm mb-5 flex items-center text-on-surface">
            <Globe className="h-5 w-5 mr-3 text-primary" />
            {t('priv.third.title')}
          </h2>
          <p className="text-on-surface-variant mb-5 leading-relaxed">{t('priv.third.intro')}</p>
          <ul className="space-y-2 text-on-surface-variant">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{t('priv.third.i1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{t('priv.third.i2')}</span>
            </li>
          </ul>
          <p className="mt-5 font-label text-label-lg text-on-surface-variant">
            {t('priv.third.note')}
          </p>
        </section>

        <section>
          <h2 className="text-headline-sm mb-4 text-on-surface">{t('priv.changes.title')}</h2>
          <p className="text-on-surface-variant leading-relaxed">
            {t('priv.changes.body')}
          </p>
        </section>

        <section>
          <h2 className="text-headline-sm mb-4 text-on-surface">{t('priv.contact.title')}</h2>
          <p className="text-on-surface-variant mb-4">
            {t('priv.contact.intro')}
          </p>
          <ul className="space-y-2 text-on-surface-variant">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>GitHub: <a href="https://github.com/marketcalls/openalgo" className="text-primary hover:underline">github.com/marketcalls/openalgo</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>Discord: <a href="/discord" className="text-primary hover:underline">{t('priv.contact.discord')}</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{t('priv.contact.email')} rajandran@openalgo.in</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-14 p-8 rounded-xl surface-low ghost-border text-center">
        <p className="text-lg font-semibold mb-2 text-on-surface">
          {t('priv.footer.title')}
        </p>
        <p className="text-on-surface-variant">
          {t('priv.footer.body')}
        </p>
      </div>
    </div>
  );
}
