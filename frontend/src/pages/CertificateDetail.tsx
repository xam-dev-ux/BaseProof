import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCertificate, useTransferCertificate, useRevokeCertificate } from '@/hooks/useCertificate';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { CategoryLabels, CategoryColors } from '@/types';
import { formatTimestamp, getRelativeTime, truncateAddress, copyToClipboard } from '@/utils/format';
import { generateCertificatePDF, downloadBlob } from '@/utils/pdf';
import {
  DocumentIcon,
  ClipboardDocumentCheckIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CertificateDetail() {
  const { id } = useParams<{ id: string }>();
  const certificateId = id ? BigInt(id) : undefined;
  const { account } = useWallet();
  const { contract } = useContract();

  const { certificate, isLoading } = useCertificate(certificateId);
  const transferMutation = useTransferCertificate();
  const revokeMutation = useRevokeCertificate();

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  const handleCopyHash = async () => {
    if (certificate) {
      const success = await copyToClipboard(certificate.documentHash);
      if (success) toast.success('Hash copied to clipboard!');
    }
  };

  const handleDownloadCertificate = async () => {
    if (!certificate) return;

    try {
      const verificationUrl = `${window.location.origin}/verify?hash=${certificate.documentHash}`;
      const pdfBlob = await generateCertificatePDF(certificate, verificationUrl);
      downloadBlob(pdfBlob, `certificate-${certificate.id}.pdf`);
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleTransfer = async () => {
    if (!certificateId || !transferAddress || !contract) return;

    try {
      const transferFee = await contract.transferFee();
      await transferMutation.mutateAsync({
        certificateId,
        newOwner: transferAddress,
        transferFee,
      });
      setShowTransferModal(false);
      setTransferAddress('');
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  const handleRevoke = async () => {
    if (!certificateId || !revokeReason) return;

    try {
      await revokeMutation.mutateAsync({
        certificateId,
        reason: revokeReason,
      });
      setShowRevokeModal(false);
      setRevokeReason('');
    } catch (error) {
      console.error('Revoke error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Certificate Not Found</h2>
          <Link to="/my-certificates" className="btn btn-primary">
            Back to My Certificates
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = account?.toLowerCase() === certificate.owner.toLowerCase();
  const isIssuer = account?.toLowerCase() === certificate.issuer.toLowerCase();
  const isExpired = certificate.expirationDate > 0n && Number(certificate.expirationDate) < Date.now() / 1000;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
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
              <h1 className="text-3xl font-bold mb-2">{certificate.title}</h1>
              <p className="text-gray-600">Certificate #{certificate.id.toString()}</p>
            </div>
          </div>

          {certificate.isRevoked && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-1">This certificate has been revoked</h3>
              <p className="text-sm text-red-700">
                Revoked on {formatTimestamp(certificate.revocationTimestamp)}
              </p>
            </div>
          )}
        </div>

        {/* Document Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Document Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Document Hash</label>
              <div className="flex items-center gap-2">
                <p className="hash-text flex-1 break-all">{certificate.documentHash}</p>
                <button
                  onClick={handleCopyHash}
                  className="btn btn-secondary p-2"
                  title="Copy hash"
                >
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This is the unique fingerprint of your document
              </p>
            </div>

            {certificate.descriptionIPFS && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-700">{certificate.descriptionIPFS}</p>
              </div>
            )}

            {certificate.originalFilename && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Original Filename
                  </label>
                  <p className="text-gray-700">{certificate.originalFilename}</p>
                </div>

                {certificate.fileExtension && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      File Type
                    </label>
                    <p className="text-gray-700">.{certificate.fileExtension}</p>
                  </div>
                )}
              </div>
            )}

            {certificate.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {certificate.tags.map((tag, i) => (
                    <span key={i} className="badge bg-blue-50 text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Certification Details */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Certification Details</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Certified By:</span>
              <span className="hash-text">{truncateAddress(certificate.issuer, 8, 6)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Current Owner:</span>
              <span className="hash-text">{truncateAddress(certificate.owner, 8, 6)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Certification Date:</span>
              <span className="font-medium">
                {formatTimestamp(certificate.certificationTimestamp)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Time Since:</span>
              <span className="font-medium">
                {getRelativeTime(certificate.certificationTimestamp)}
              </span>
            </div>

            {certificate.expirationDate > 0n && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expiration Date:</span>
                <span className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
                  {formatTimestamp(certificate.expirationDate)}
                  {isExpired && ' (Expired)'}
                </span>
              </div>
            )}

            {certificate.renewalCount > 0n && (
              <div className="flex justify-between">
                <span className="text-gray-600">Renewals:</span>
                <span className="font-medium">{certificate.renewalCount.toString()}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Co-Certifiers */}
        {(certificate.coCertifiers.length > 0 || certificate.pendingCoCertifiers.length > 0) && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Co-Certifiers</h2>

            {certificate.coCertifiers.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Accepted:</h3>
                <div className="space-y-2">
                  {certificate.coCertifiers.map((addr, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="hash-text">{addr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certificate.pendingCoCertifiers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Pending:</h3>
                <div className="space-y-2">
                  {certificate.pendingCoCertifiers.map((addr, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-yellow-500 rounded-full" />
                      <span className="hash-text">{addr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!certificate.isRevoked && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={handleDownloadCertificate} className="btn btn-primary">
                <DocumentIcon className="h-5 w-5 mr-2" />
                Download Certificate PDF
              </button>

              {isOwner && (
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="btn btn-secondary"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                  Transfer Certificate
                </button>
              )}

              {(isOwner || isIssuer) && (
                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Revoke Certificate
                </button>
              )}
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Transfer Certificate</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Owner Address
                </label>
                <input
                  type="text"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="input"
                  placeholder="0x..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Transfer Fee:</strong> 0.0005 ETH
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!transferAddress || transferMutation.isPending}
                  className="btn btn-primary flex-1"
                >
                  {transferMutation.isPending ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Modal */}
        {showRevokeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Revoke Certificate</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Revocation
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="input"
                  rows={4}
                  placeholder="Explain why this certificate is being revoked..."
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone. The certificate will be
                  permanently marked as revoked.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={!revokeReason || revokeMutation.isPending}
                  className="btn bg-red-600 text-white hover:bg-red-700 flex-1"
                >
                  {revokeMutation.isPending ? 'Revoking...' : 'Revoke'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
