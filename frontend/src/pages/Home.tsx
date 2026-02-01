import { Link } from 'react-router-dom';
import { usePlatformStats } from '@/hooks/useCertificate';
import {
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { CategoryLabels, Category } from '@/types';

export default function Home() {
  const { stats } = usePlatformStats();

  const features = [
    {
      icon: ClockIcon,
      title: 'Instant Timestamping',
      description: 'Get immutable proof of existence in seconds, not days or weeks.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Affordable',
      description: 'Certify documents for ~$0.10, compared to $50+ for traditional notaries.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global & Decentralized',
      description: 'No jurisdiction limits. Available 24/7 from anywhere in the world.',
    },
    {
      icon: LockClosedIcon,
      title: 'Privacy-First',
      description: 'Your documents stay private. Only cryptographic hashes are stored onchain.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Immutable Proof',
      description: 'Cannot be backdated or altered. Cryptographically secured forever.',
    },
    {
      icon: CheckCircleIcon,
      title: 'Legally Recognized',
      description: 'Blockchain timestamps are increasingly admissible in courts worldwide.',
    },
  ];

  const useCases = [
    {
      title: 'Legal Contracts',
      description: 'Timestamp agreements with irrefutable proof',
      icon: '⚖️',
      category: Category.LEGAL,
    },
    {
      title: 'Creative Works',
      description: 'Prove authorship of art, music, writing',
      icon: '🎨',
      category: Category.CREATIVE,
    },
    {
      title: 'Patents & IP',
      description: 'Establish prior art and invention dates',
      icon: '💡',
      category: Category.INTELLECTUAL_PROPERTY,
    },
    {
      title: 'Academic Credentials',
      description: 'Verify diplomas and certificates instantly',
      icon: '🎓',
      category: Category.ACADEMIC,
    },
    {
      title: 'Business Documents',
      description: 'Certify invoices, receipts, NDAs',
      icon: '💼',
      category: Category.BUSINESS,
    },
    {
      title: 'Property Deeds',
      description: 'Immutable proof of real estate ownership',
      icon: '🏠',
      category: Category.REAL_ESTATE,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Prove It. Protect It. Forever.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Timestamp and certify any document on the blockchain. Immutable proof of existence and ownership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/certify"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Certify Document
              </Link>
              <Link
                to="/verify"
                className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              >
                Verify Document
              </Link>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.totalCertificates.toString()}</div>
                  <div className="text-blue-200 text-sm">Documents Certified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.totalIssuers.toString()}</div>
                  <div className="text-blue-200 text-sm">Creators Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-blue-200 text-sm">Immutable</div>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-100">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                100% Immutable
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                Legally Recognized
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                Privacy-First
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
            <p className="text-xl text-gray-600">
              Protect any type of document with blockchain-backed proof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <Link
                  to={`/explorer?category=${useCase.category}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Explore {CategoryLabels[useCase.category]} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Three simple steps to永久 protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload & Hash</h3>
              <p className="text-gray-600">
                Upload your document. We compute its unique fingerprint (hash). Your document never leaves your device.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Certify Onchain</h3>
              <p className="text-gray-600">
                Pay small fee (~$0.10). Get immutable timestamp and certificate on Base blockchain.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify Anytime</h3>
              <p className="text-gray-600">
                Anyone with the document can verify its certification. Prove who, when, and if altered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why BaseProof?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators, businesses, and individuals protecting their work with BaseProof
          </p>
          <Link
            to="/certify"
            className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold inline-block"
          >
            Certify Your First Document
          </Link>
        </div>
      </section>
    </div>
  );
}
