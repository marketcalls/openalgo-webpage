import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">OpenAlgo Chrome Extension - Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">Last Updated: March 30, 2025</p>

      <div className="prose max-w-none">
        <p className="mb-4">
          This Privacy Policy describes how your personal information is collected, used, and shared 
          when you use the OpenAlgo Chrome Extension.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Information We Collect</h2>
        <p className="mb-2">OpenAlgo Chrome Extension collects and stores:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>API keys provided by you for authentication with the OpenAlgo trading platform</li>
          <li>Trading preferences including symbols, exchange, product type, and quantities</li>
          <li>Host URL for connecting to OpenAlgo servers</li>
        </ul>
        <p className="mb-4">
          All data is stored locally in your browser using Chrome's secure storage API and is never
          transmitted to third parties except to the OpenAlgo API servers specified by you to execute
          trading functions.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
        <p className="mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Authenticate your access to the OpenAlgo trading platform</li>
          <li>Execute trading orders as per your instructions</li>
          <li>Store your preferences to provide a personalized trading experience</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Data Storage</h2>
        <p className="mb-4">
          All user data is stored locally in your browser using Chrome's storage.sync API. Your data
          never leaves your browser except when necessary to communicate with the OpenAlgo API servers
          you specify in the settings.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Third-Party Sharing</h2>
        <p className="mb-4">
          We do not sell or transfer your data to third parties. Your data is only used to communicate
          with the OpenAlgo API servers as specified by you in the extension settings.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your personal information. However, no method of
          transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee
          its absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or delete your personal information at any time. You can
          do this directly through the extension's settings panel.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this privacy policy from time to time to reflect changes to our practices or for
          other operational, legal, or regulatory reasons.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
        <p className="mb-4">
          For more information about our privacy practices or if you have questions, please contact us at
          rajandran@openalgo.in.
        </p>
      </div>
    </div>
  );
}
