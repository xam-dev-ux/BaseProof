import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">BaseProof</span>
            </div>
            <p className="text-sm text-gray-400">
              Immutable proof of existence and ownership on the blockchain.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/certify" className="hover:text-white transition-colors">
                  Certify Document
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition-colors">
                  Verify Document
                </Link>
              </li>
              <li>
                <Link to="/my-certificates" className="hover:text-white transition-colors">
                  My Certificates
                </Link>
              </li>
              <li>
                <Link to="/explorer" className="hover:text-white transition-colors">
                  Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://docs.base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/xam-dev-ux/baseproof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://docs.base.org/mini-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Base Mini Apps
                </a>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/terms#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms#disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-sm text-center space-y-2">
            <p className="text-red-400 font-semibold">
              ⚠️ USE AT YOUR OWN RISK - NO LIABILITY
            </p>
            <p>
              BaseProof is an experimental platform. Smart contracts may contain bugs.
              Not legal advice. Read{' '}
              <Link to="/terms" className="text-primary-400 hover:text-primary-300 underline">
                Terms & Disclaimer
              </Link>
              {' '}before using.
            </p>
            <p className="text-gray-500">
              &copy; {currentYear} BaseProof. Built on{' '}
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400"
              >
                Base Mainnet
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
