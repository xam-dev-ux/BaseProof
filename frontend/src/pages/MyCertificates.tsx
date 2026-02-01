import { Link } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { useMyCertificates, useCertificate } from '@/hooks/useCertificate';
import { CategoryLabels, CategoryColors } from '@/types';
import { formatTimestamp, truncateHash } from '@/utils/format';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface CertificateCardProps {
  certificateId: bigint;
}

function CertificateCard({ certificateId }: CertificateCardProps) {
  const { certificate, isLoading } = useCertificate(certificateId);

  if (isLoading || !certificate) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  const isExpired = certificate.expirationDate > 0n && Number(certificate.expirationDate) < Date.now() / 1000;

  return (
    <Link to={`/certificate/${certificate.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`badge ${CategoryColors[certificate.category]}`}>
              {CategoryLabels[certificate.category]}
            </span>
            {certificate.isRevoked ? (
              <span className="badge bg-red-100 text-red-800">Revoked</span>
            ) : isExpired ? (
              <span className="badge bg-yellow-100 text-yellow-800">Expired</span>
            ) : (
              <span className="badge bg-green-100 text-green-800">Active</span>
            )}
            {!certificate.isPublic && (
              <span className="badge bg-gray-100 text-gray-800">Private</span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">{certificate.title}</h3>
        </div>
        <span className="text-sm font-mono text-gray-500">#{certificate.id.toString()}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Certified:</span>
          <span className="font-medium">{formatTimestamp(certificate.certificationTimestamp)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Hash:</span>
          <span className="font-mono">{truncateHash(certificate.documentHash, 8, 6)}</span>
        </div>

        {certificate.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {certificate.tags.map((tag, i) => (
              <span key={i} className="badge bg-blue-50 text-blue-700 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function MyCertificates() {
  const { isConnected } = useWallet();
  const { issuedCertificates, ownedCertificates, isLoading } = useMyCertificates();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Certificates</h1>
          <p className="text-xl text-gray-600">
            View and manage all your certified documents
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Total Certificates</div>
            <div className="text-3xl font-bold text-primary-700">
              {issuedCertificates.length + ownedCertificates.length}
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Issued by Me</div>
            <div className="text-3xl font-bold text-purple-700">
              {issuedCertificates.length}
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Owned by Me</div>
            <div className="text-3xl font-bold text-blue-700">
              {ownedCertificates.length}
            </div>
          </div>
        </div>

        {/* Issued Certificates */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Issued by Me</h2>
            <Link to="/certify" className="btn btn-primary">
              Certify New Document
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : issuedCertificates.length === 0 ? (
            <div className="card text-center py-12">
              <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't issued any certificates yet.</p>
              <Link to="/certify" className="btn btn-primary inline-block">
                Certify Your First Document
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issuedCertificates.map((certId: bigint) => (
                <CertificateCard key={certId.toString()} certificateId={certId} />
              ))}
            </div>
          )}
        </div>

        {/* Owned Certificates */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Owned by Me</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : ownedCertificates.length === 0 ? (
            <div className="card text-center py-12">
              <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You don't own any transferred certificates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedCertificates
                .filter((certId: bigint) => !issuedCertificates.includes(certId))
                .map((certId: bigint) => (
                  <CertificateCard key={certId.toString()} certificateId={certId} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
