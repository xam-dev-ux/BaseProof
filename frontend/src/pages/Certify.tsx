import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { useCertifyDocument } from '@/hooks/useCertificate';
import { computeFileHash } from '@/utils/hash';
import { Category, CategoryLabels } from '@/types';
import {
  DocumentPlusIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Certify() {
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();
  const { contract } = useContract();
  const certifyMutation = useCertifyDocument();

  const [file, setFile] = useState<File | null>(null);
  const [documentHash, setDocumentHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.OTHER,
    tags: '',
    isPublic: true,
    coCertifiers: '',
    hasExpiration: false,
    expirationDate: '',
  });

  const [step, setStep] = useState<'upload' | 'details' | 'review'>('upload');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);

        // Compute hash
        setIsHashing(true);
        try {
          const hash = await computeFileHash(selectedFile);
          setDocumentHash(hash);
          setFormData({
            ...formData,
            title: selectedFile.name.replace(/\.[^/.]+$/, ''), // Remove extension
          });
          setStep('details');
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!documentHash || !formData.title) {
      toast.error('Please complete all required fields');
      return;
    }

    if (!contract) {
      toast.error('Contract not initialized');
      return;
    }

    try {
      // Get certification fee
      const certificationFee = await contract.certificationFee();

      // Parse co-certifiers
      const coCertifiers = formData.coCertifiers
        .split(',')
        .map((addr) => addr.trim())
        .filter((addr) => addr.length > 0);

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Parse expiration date
      let expirationTimestamp = 0;
      if (formData.hasExpiration && formData.expirationDate) {
        expirationTimestamp = Math.floor(new Date(formData.expirationDate).getTime() / 1000);
      }

      // Get file extension
      const fileExtension = file?.name.split('.').pop() || '';

      const result = await certifyMutation.mutateAsync({
        documentHash,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        isPublic: formData.isPublic,
        coCertifiers,
        expirationDate: expirationTimestamp,
        tags,
        originalFilename: file?.name || '',
        fileExtension,
        certificationFee,
      });

      toast.success('Document certified successfully!');
      navigate(`/certificate/${result.certificateId}`);
    } catch (error: any) {
      console.error('Certification error:', error);
      toast.error(error.message || 'Failed to certify document');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <DocumentPlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to certify documents on the blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Certify Document</h1>
          <p className="text-xl text-gray-600">
            Create an immutable timestamp and proof of existence on the blockchain
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                step === 'upload' ? 'text-primary-700' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'upload' ? 'bg-primary-100' : 'bg-gray-100'
                }`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>

            <div className="w-16 h-1 bg-gray-300" />

            <div
              className={`flex items-center ${
                step === 'details' ? 'text-primary-700' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'details' ? 'bg-primary-100' : 'bg-gray-100'
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Details</span>
            </div>

            <div className="w-16 h-1 bg-gray-300" />

            <div
              className={`flex items-center ${
                step === 'review' ? 'text-primary-700' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'review' ? 'bg-primary-100' : 'bg-gray-100'
                }`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Step 1: Upload Document</h2>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <DocumentPlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                    Accepts all file types. Your file never leaves your device.
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{file.name}</p>
                    <p className="text-sm text-green-700">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setDocumentHash('');
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            )}

            {documentHash && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Document Hash (SHA-256):</p>
                <p className="hash-text break-all">{documentHash}</p>
              </div>
            )}

            <div className="mt-6 border-t pt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Privacy Notice</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Your document never leaves your device</li>
                  <li>• Only the cryptographic hash is stored on the blockchain</li>
                  <li>• Same document always produces the same hash</li>
                  <li>• Even 1-bit change produces a completely different hash</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Step 2: Certificate Details</h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="My Patent Application"
                  required
                  minLength={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">3-200 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={4}
                  placeholder="Brief description of the document..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  {Object.entries(CategoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional, max 5)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="patent, invention, 2026"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated tags</p>
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Setting *
                </label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={() => setFormData({ ...formData, isPublic: true })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-gray-600">
                        Anyone can verify full certificate details
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={!formData.isPublic}
                      onChange={() => setFormData({ ...formData, isPublic: false })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-gray-600">
                        Only you (and co-certifiers) see full details. Others only see that document exists.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Co-Certifiers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Co-Certifiers (Optional)
                </label>
                <input
                  type="text"
                  name="coCertifiers"
                  value={formData.coCertifiers}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="0x..., 0x..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated addresses. They must accept co-certification afterward.
                </p>
              </div>

              {/* Expiration */}
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    name="hasExpiration"
                    checked={formData.hasExpiration}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    This certificate expires
                  </span>
                </label>

                {formData.hasExpiration && (
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep('upload')} className="btn btn-secondary">
                Back
              </button>
              <button
                onClick={() => setStep('review')}
                className="btn btn-primary"
                disabled={!formData.title}
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Step 3: Review & Certify</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Document Hash</label>
                <p className="hash-text break-all mt-1">{documentHash}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Title</label>
                <p className="mt-1">{formData.title}</p>
              </div>

              {formData.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1">{formData.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="mt-1">{CategoryLabels[formData.category]}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Privacy</label>
                <p className="mt-1">{formData.isPublic ? 'Public' : 'Private'}</p>
              </div>

              {file && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">File</label>
                  <p className="mt-1">{file.name}</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Fee Breakdown</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span>Certification Fee:</span>
                  <span>0.001 ETH (~$2.50)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Gas:</span>
                  <span>~0.00006 ETH (~$0.15)</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-blue-300 pt-1 mt-1">
                  <span>Total:</span>
                  <span>~0.00106 ETH (~$2.65)</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1 rounded" required />
                <span className="text-sm text-gray-700">
                  I confirm I have rights to certify this document
                </span>
              </label>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep('details')} className="btn btn-secondary">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={certifyMutation.isPending}
                className="btn btn-primary"
              >
                {certifyMutation.isPending ? 'Certifying...' : 'Certify Document'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
