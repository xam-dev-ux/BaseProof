import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlatformStats } from '@/hooks/useCertificate';
import { Category, CategoryLabels, CategoryColors } from '@/types';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Explorer() {
  const { stats, isLoading } = usePlatformStats();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <GlobeAltIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Certificate Explorer</h1>
          <p className="text-xl text-gray-600">
            Browse all public certificates on the blockchain
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-700 mb-1">
              {isLoading ? '...' : stats?.totalCertificates.toString()}
            </div>
            <div className="text-sm text-gray-600">Total Certificates</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-700 mb-1">
              {isLoading ? '...' : stats?.totalIssuers.toString()}
            </div>
            <div className="text-sm text-gray-600">Total Issuers</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {isLoading ? '...' : stats?.totalPublic.toString()}
            </div>
            <div className="text-sm text-gray-600">Public</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-700 mb-1">
              {isLoading ? '...' : stats?.totalPrivate.toString()}
            </div>
            <div className="text-sm text-gray-600">Private</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-red-700 mb-1">
              {isLoading ? '...' : stats?.totalRevoked.toString()}
            </div>
            <div className="text-sm text-gray-600">Revoked</div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(CategoryLabels).map(([key, label]) => {
              const category = parseInt(key) as Category;
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(isSelected ? null : category)}
                  className={`card text-center hover:shadow-lg transition-shadow ${
                    isSelected ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className={`badge ${CategoryColors[category]} mb-2 mx-auto`}>
                    {label}
                  </div>
                  <div className="text-sm text-gray-500">
                    Click to filter
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Message */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Coming Soon</h3>
          <p className="text-sm text-blue-800 mb-4">
            The full certificate browser with filtering, search, and pagination is under development.
            For now, you can:
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• View statistics above</li>
            <li>• <Link to="/verify" className="underline font-medium">Verify specific documents</Link> if you have the hash</li>
            <li>• <Link to="/my-certificates" className="underline font-medium">View your own certificates</Link></li>
          </ul>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card">
            <h3 className="font-semibold mb-2">Real-Time Data</h3>
            <p className="text-sm text-gray-600">
              All statistics are fetched directly from the blockchain in real-time.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Privacy Respected</h3>
            <p className="text-sm text-gray-600">
              Only public certificates are shown. Private certificates remain hidden.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Fully Decentralized</h3>
            <p className="text-sm text-gray-600">
              No central database. All data lives permanently on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
