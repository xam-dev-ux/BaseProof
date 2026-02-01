export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-8">Terms of Use & Disclaimer</h1>

          <div className="space-y-6 text-gray-700">
            {/* NO LIABILITY */}
            <section>
              <h2 className="text-xl font-bold text-red-900 mb-3">⚠️ NO LIABILITY</h2>
              <p className="leading-relaxed">
                By using BaseProof, you acknowledge and agree that the developers, creators, operators,
                and affiliates of this platform shall <strong>not be held liable</strong> for any direct,
                indirect, incidental, special, consequential, or exemplary damages, including but not
                limited to loss of funds, assets, profits, data, or any other losses arising from your
                use of this service.
              </p>
            </section>

            {/* USE AT YOUR OWN RISK */}
            <section>
              <h2 className="text-xl font-bold text-red-900 mb-3">🚨 USE AT YOUR OWN RISK</h2>
              <p className="leading-relaxed">
                BaseProof is an experimental decentralized application provided <strong>"as is"</strong> without
                warranties of any kind. Smart contracts may contain bugs, vulnerabilities, or behave
                unexpectedly. You are <strong>solely responsible</strong> for your interactions with the
                blockchain and any assets you deposit or certify.
              </p>
            </section>

            {/* NOT LEGAL ADVICE */}
            <section>
              <h2 className="text-xl font-bold text-yellow-900 mb-3">⚖️ NOT LEGAL ADVICE</h2>
              <p className="leading-relaxed">
                This platform is a <strong>technical tool only</strong> and does not constitute legal,
                financial, or professional advice. The enforceability of blockchain timestamps varies
                by jurisdiction and may not be recognized by legal authorities.
                <strong> Consult qualified professionals</strong> for legal, estate planning, or
                intellectual property matters.
              </p>
            </section>

            {/* IRREVERSIBLE TRANSACTIONS */}
            <section>
              <h2 className="text-xl font-bold text-orange-900 mb-3">🔒 IRREVERSIBLE TRANSACTIONS</h2>
              <p className="leading-relaxed">
                Blockchain transactions are <strong>permanent and irreversible</strong>. Once a document
                is certified, the certification cannot be deleted (though it can be revoked). Once fees
                are paid, they cannot be recovered by the platform.
                <strong> Verify all information carefully</strong> before confirming transactions.
              </p>
            </section>

            {/* NO DOCUMENT STORAGE */}
            <section>
              <h2 className="text-xl font-bold text-blue-900 mb-3">📄 NO DOCUMENT STORAGE</h2>
              <p className="leading-relaxed">
                BaseProof <strong>does not store your documents</strong>. Only cryptographic hashes
                (fingerprints) are stored on the blockchain. You are responsible for maintaining your
                original documents. If you lose a document, the hash cannot recreate it.
                <strong> Keep secure backups</strong> of all certified documents.
              </p>
            </section>

            {/* PRIVACY & SECURITY */}
            <section>
              <h2 className="text-xl font-bold text-purple-900 mb-3">🔐 PRIVACY & SECURITY</h2>
              <p className="leading-relaxed">
                While your documents never leave your device during hashing, blockchain data is
                <strong> permanent and public</strong>. Private certificates hide details from public
                view, but the existence of a certification is always visible. Consider privacy
                implications before certifying sensitive documents.
                <strong> Never certify documents containing passwords, private keys, or sensitive
                personal information</strong>.
              </p>
            </section>

            {/* REGULATORY COMPLIANCE */}
            <section>
              <h2 className="text-xl font-bold text-indigo-900 mb-3">📋 REGULATORY COMPLIANCE</h2>
              <p className="leading-relaxed">
                You are <strong>responsible for ensuring compliance</strong> with all applicable laws
                and regulations in your jurisdiction. The availability of this service does not imply
                legality in your location. Some jurisdictions may have specific requirements for
                document certification, notarization, or timestamping.
                <strong> Consult local legal counsel</strong> to ensure compliance.
              </p>
            </section>

            {/* INTELLECTUAL PROPERTY */}
            <section>
              <h2 className="text-xl font-bold text-pink-900 mb-3">💡 INTELLECTUAL PROPERTY</h2>
              <p className="leading-relaxed">
                Certifying a document on BaseProof <strong>does not grant or transfer any intellectual
                property rights</strong>. It only provides a timestamp proving the document existed at
                a specific point in time. You are responsible for ensuring you have the right to certify
                any document you submit.
                <strong> Do not certify documents you do not own or have permission to certify</strong>.
              </p>
            </section>

            {/* SMART CONTRACT RISKS */}
            <section>
              <h2 className="text-xl font-bold text-red-900 mb-3">⚙️ SMART CONTRACT RISKS</h2>
              <p className="leading-relaxed">
                Smart contracts are <strong>immutable and cannot be updated</strong> once deployed.
                While BaseProof has been tested, there is always a risk of bugs, exploits, or
                unexpected behavior. The contract may be paused in emergencies, but this could
                temporarily prevent access to functionality.
                <strong> Use at your own risk</strong>.
              </p>
            </section>

            {/* BLOCKCHAIN RISKS */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">⛓️ BLOCKCHAIN & NETWORK RISKS</h2>
              <p className="leading-relaxed">
                BaseProof relies on the Base blockchain network. Network congestion, forks, attacks,
                or failures could impact functionality. Gas prices may fluctuate significantly.
                The blockchain may undergo upgrades or changes that affect compatibility.
                <strong> The platform has no control over blockchain infrastructure</strong>.
              </p>
            </section>

            {/* FEES */}
            <section>
              <h2 className="text-xl font-bold text-green-900 mb-3">💰 FEES & PAYMENTS</h2>
              <p className="leading-relaxed">
                All fees (certification, transfer, renewal) are <strong>non-refundable</strong>.
                Fees are collected by the smart contract and distributed to configured commission
                wallets. Platform operators may update fee structures for future certifications
                (but cannot change fees for existing certificates).
                <strong> Review fees carefully before each transaction</strong>.
              </p>
            </section>

            {/* MODIFICATIONS */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">📝 MODIFICATIONS TO TERMS</h2>
              <p className="leading-relaxed">
                These terms may be updated at any time without prior notice. Continued use of
                BaseProof after changes constitutes acceptance of updated terms.
                <strong> Check this page regularly</strong> for updates.
              </p>
            </section>

            {/* ACCEPTANCE */}
            <section className="mt-8 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h2 className="text-xl font-bold text-blue-900 mb-3">✅ ACCEPTANCE OF TERMS</h2>
              <p className="leading-relaxed font-semibold">
                By connecting your wallet and using BaseProof, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Use & Disclaimer in their entirety.
                If you do not agree with these terms, <strong>do not use this platform</strong>.
              </p>
            </section>

            {/* CONTACT */}
            <section className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-bold mb-2">Contact & Support</h2>
              <p className="text-sm text-gray-600">
                For questions or concerns about these terms, please visit our{' '}
                <a href="https://github.com/xam-dev-ux/baseproof" className="link">
                  GitHub repository
                </a>{' '}
                or contact the development team.
              </p>
            </section>

            {/* Last Updated */}
            <div className="mt-6 text-sm text-gray-500 text-center">
              <p>Last Updated: February 2026</p>
              <p className="mt-2">
                BaseProof v1.0.0 | Built on Base Mainnet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
