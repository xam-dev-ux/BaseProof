import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useVerifyDocument } from '@/hooks/useCertificate';
import { computeFileHash, isValidHash } from '@/utils/hash';
import { formatTimestamp, getRelativeTime } from '@/utils/format';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentMagnifyingGlassIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Verify() {
  const [documentHash, setDocumentHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [verificationMode, setVerificationMode] = useState<'upload' | 'hash'>('upload');

  const verifyMutation = useVerifyDocument();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setIsHashing(true);

        try {
          const hash = await computeFileHash(file);
          setDocumentHash(hash);
          toast.success('File hash computed successfully!');
        } catch (error) {
          console.error('Error hashing file:', error);
          toast.error('Failed to compute file hash');
        } finally {
          setIsHashing(false);
        }
      }
    },
    multiple: false,
  });

  const handleVerify = async () => {
    if (!documentHash) {
      toast.error('Please provide a document hash');
      return;
    }

    if (!isValidHash(documentHash)) {
      toast.error('Invalid hash format');
      return;
    }

    try {
      await verifyMutation.mutateAsync(documentHash);
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Failed to verify document');
    }
  };

  const result = verifyMutation.data;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Verify Document</h1>
          <p className="text-xl text-gray-600">
            Check if a document has been certified on the blockchain
          </p>
        </div>

        {/* Verification Method Selector */}
        <div className="card mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setVerificationMode('upload')}
              className={`flex-1 btn ${
                verificationMode === 'upload' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setVerificationMode('hash')}
              className={`flex-1 btn ${
                verificationMode === 'hash' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              Paste Hash
            </button>
          </div>

          {/* Upload Mode */}
          {verificationMode === 'upload' && (
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <DocumentMagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                {isHashing ? (
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Computing document hash...
                    </p>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      We'll compute its hash and check if it's certified
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Privacy:</strong> Your file stays on your device. Only the hash is used
                  for verification.
                </p>
              </div>
            </div>
          )}

          {/* Hash Mode */}
          {verificationMode === 'hash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Hash (SHA-256)
              </label>
              <input
                type="text"
                value={documentHash}
                onChange={(e) => setDocumentHash(e.target.value)}
                className="input font-mono"
                placeholder="0x..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the document's SHA-256 hash (66 characters starting with 0x)
              </p>
            </div>
          )}

          {documentHash && (
            <div className="mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Document Hash:</p>
                <p className="hash-text break-all">{documentHash}</p>
              </div>

              <button
                onClick={handleVerify}
                disabled={verifyMutation.isPending}
                className="btn btn-primary w-full mt-4"
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify Document'}
              </button>
            </div>
          )}
        </div>

        {/* Verification Result */}
        {result && (
          <div className="card">
            {result.exists ? (
              <div>
                {/* Verified Header */}
                <div className="text-center mb-8 pb-8 border-b">
                  <CheckCircleIcon className="h-20 w-20 text-green-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-green-900 mb-2">VERIFIED</h2>
                  <p className="text-lg text-gray-700">
                    This document was certified on{' '}
                    <strong>{formatTimestamp(result.timestamp)}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    {getRelativeTime(result.timestamp)}
                  </p>
                </div>

                {/* Certificate Details */}
                {result.isPublic ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Certificate ID
                        </label>
                        <p className="mt-1 font-mono">#{result.certificateId.toString()}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          {result.isRevoked ? (
                            <span className="badge bg-red-100 text-red-800">Revoked</span>
                          ) : (
                            <span className="badge bg-green-100 text-green-800">Active</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {result.title && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Title</label>
                        <p className="mt-1 text-lg font-semibold">{result.title}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Certified By
                      </label>
                      <p className="mt-1 hash-text">{result.issuer}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Current Owner
                      </label>
                      <p className="mt-1 hash-text">{result.currentOwner}</p>
                      {result.issuer !== result.currentOwner && (
                        <p className="text-sm text-yellow-600 mt-1">
                          Ownership has been transferred
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Certification Date
                      </label>
                      <p className="mt-1">{formatTimestamp(result.timestamp)}</p>
                    </div>

                    {result.isRevoked && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="font-semibold text-red-900 mb-1">
                          This certificate has been revoked
                        </h3>
                        <p className="text-sm text-red-700">
                          The issuer or owner has revoked this certificate. Please contact them
                          for more information.
                        </p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t">
                      <Link
                        to={`/certificate/${result.certificateId}`}
                        className="btn btn-primary w-full"
                      >
                        View Full Certificate Details
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <LockClosedIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Private Certificate</h3>
                    <p className="text-gray-600 mb-4">
                      This document exists in our system but details are private.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between max-w-md mx-auto">
                        <span className="text-gray-500">Certificate exists:</span>
                        <span className="font-semibold">Yes</span>
                      </div>
                      <div className="flex justify-between max-w-md mx-auto">
                        <span className="text-gray-500">Certified on:</span>
                        <span className="font-semibold">
                          {formatTimestamp(result.timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between max-w-md mx-auto">
                        <span className="text-gray-500">Details:</span>
                        <span className="font-semibold">Hidden</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                      If you are the owner, connect your wallet to view full details
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-red-900 mb-2">NOT FOUND</h2>
                <p className="text-lg text-gray-700 mb-6">
                  This document has not been certified on BaseProof.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto text-left">
                  <h3 className="font-semibold text-yellow-900 mb-2">Suggestions:</h3>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    <li>• Certify it now to protect your work</li>
                    <li>• Are you sure this is the correct file?</li>
                    <li>• Try uploading again or check the hash</li>
                  </ul>
                </div>

                <Link to="/certify" className="btn btn-primary mt-6 inline-block">
                  Certify This Document
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!result && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">Fast Verification</h3>
              <p className="text-sm text-gray-600">
                Instant verification of any document's certification status on the blockchain.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Privacy Protected</h3>
              <p className="text-sm text-gray-600">
                Your document stays on your device. Only the hash is used for verification.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Immutable Record</h3>
              <p className="text-sm text-gray-600">
                Verification data is permanently stored on the Base blockchain.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
