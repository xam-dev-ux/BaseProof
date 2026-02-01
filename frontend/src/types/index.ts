export enum Category {
  LEGAL = 0,
  INTELLECTUAL_PROPERTY = 1,
  CREATIVE = 2,
  ACADEMIC = 3,
  BUSINESS = 4,
  IDENTITY = 5,
  REAL_ESTATE = 6,
  MEDICAL = 7,
  GOVERNMENT = 8,
  OTHER = 9,
}

export const CategoryLabels: Record<Category, string> = {
  [Category.LEGAL]: 'Legal',
  [Category.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
  [Category.CREATIVE]: 'Creative',
  [Category.ACADEMIC]: 'Academic',
  [Category.BUSINESS]: 'Business',
  [Category.IDENTITY]: 'Identity',
  [Category.REAL_ESTATE]: 'Real Estate',
  [Category.MEDICAL]: 'Medical',
  [Category.GOVERNMENT]: 'Government',
  [Category.OTHER]: 'Other',
};

export const CategoryColors: Record<Category, string> = {
  [Category.LEGAL]: 'bg-blue-100 text-blue-800',
  [Category.INTELLECTUAL_PROPERTY]: 'bg-purple-100 text-purple-800',
  [Category.CREATIVE]: 'bg-pink-100 text-pink-800',
  [Category.ACADEMIC]: 'bg-green-100 text-green-800',
  [Category.BUSINESS]: 'bg-yellow-100 text-yellow-800',
  [Category.IDENTITY]: 'bg-indigo-100 text-indigo-800',
  [Category.REAL_ESTATE]: 'bg-orange-100 text-orange-800',
  [Category.MEDICAL]: 'bg-red-100 text-red-800',
  [Category.GOVERNMENT]: 'bg-gray-100 text-gray-800',
  [Category.OTHER]: 'bg-slate-100 text-slate-800',
};

export interface TransferRecord {
  from: string;
  to: string;
  timestamp: bigint;
}

export interface Certificate {
  id: bigint;
  documentHash: string;
  issuer: string;
  owner: string;
  title: string;
  descriptionIPFS: string;
  category: Category;
  certificationTimestamp: bigint;
  metadataIPFS: string;
  isPublic: boolean;
  isRevoked: boolean;
  revocationReasonIPFS: string;
  revocationTimestamp: bigint;
  coCertifiers: string[];
  pendingCoCertifiers: string[];
  expirationDate: bigint;
  renewalCount: bigint;
  tags: string[];
  originalFilename: string;
  fileExtension: string;
}

export interface VerificationResult {
  exists: boolean;
  certificateId: bigint;
  issuer: string;
  currentOwner: string;
  title: string;
  timestamp: bigint;
  isRevoked: boolean;
  isPublic: boolean;
}

export interface ChallengeData {
  challenger: string;
  challengeIPFS: string;
  bondAmount: bigint;
  timestamp: bigint;
  resolved: boolean;
  challengerWon: boolean;
}

export interface PlatformStats {
  totalCertificates: bigint;
  totalIssuers: bigint;
  totalRevoked: bigint;
  totalPublic: bigint;
  totalPrivate: bigint;
}

export interface IssuerStats {
  totalIssued: bigint;
  totalRevoked: bigint;
  totalTransferred: bigint;
  certificateIds: bigint[];
}

export interface CertificationFormData {
  file?: File;
  documentHash?: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  isPublic: boolean;
  coCertifiers: string[];
  expirationDate?: Date;
  originalFilename: string;
  fileExtension: string;
}
