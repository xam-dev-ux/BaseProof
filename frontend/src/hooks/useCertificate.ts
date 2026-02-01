import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { Certificate, VerificationResult, PlatformStats, IssuerStats } from '@/types';
import { uploadToIPFS } from '@/utils/ipfs';
import toast from 'react-hot-toast';

export function useCertificate(certificateId?: bigint) {
  const { contract } = useContract();

  const { data: certificate, isLoading } = useQuery({
    queryKey: ['certificate', certificateId?.toString()],
    queryFn: async () => {
      if (!contract || !certificateId) return null;
      const cert = await contract.getCertificate(certificateId);
      return cert as Certificate;
    },
    enabled: !!contract && !!certificateId,
  });

  return {
    certificate,
    isLoading,
  };
}

export function useVerifyDocument() {
  const { contract } = useContract();

  return useMutation({
    mutationFn: async (documentHash: string): Promise<VerificationResult> => {
      if (!contract) throw new Error('Contract not initialized');
      const result = await contract.verifyDocument(documentHash);
      return {
        exists: result[0],
        certificateId: result[1],
        issuer: result[2],
        currentOwner: result[3],
        title: result[4],
        timestamp: result[5],
        isRevoked: result[6],
        isPublic: result[7],
      };
    },
  });
}

export function useCertifyDocument() {
  const { contract } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      documentHash: string;
      title: string;
      category: number;
      description: string;
      isPublic: boolean;
      coCertifiers?: string[];
      expirationDate?: number;
      tags: string[];
      originalFilename: string;
      fileExtension: string;
      certificationFee: bigint;
    }) => {
      if (!contract) throw new Error('Contract not initialized');

      // Upload description to IPFS if provided
      let descriptionIPFS = '';
      let metadataIPFS = '';

      if (params.description) {
        descriptionIPFS = await uploadToIPFS({ description: params.description });
      }

      // Create metadata
      const metadata = {
        title: params.title,
        description: params.description,
        category: params.category,
        tags: params.tags,
        originalFilename: params.originalFilename,
        fileExtension: params.fileExtension,
        certificationDate: Date.now(),
      };
      metadataIPFS = await uploadToIPFS(metadata);

      const tx = await contract.certifyDocument(
        params.documentHash,
        params.title,
        params.category,
        metadataIPFS,
        descriptionIPFS,
        params.isPublic,
        params.coCertifiers || [],
        params.expirationDate || 0,
        params.tags,
        params.originalFilename,
        params.fileExtension,
        { value: params.certificationFee }
      );

      const receipt = await tx.wait();

      // Extract certificate ID from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'DocumentCertified';
        } catch {
          return false;
        }
      });

      let certificateId = 0n;
      if (event) {
        const parsed = contract.interface.parseLog(event);
        certificateId = parsed?.args[0];
      }

      return {
        receipt,
        certificateId,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
      toast.success('Document certified successfully!');
    },
    onError: (error: any) => {
      console.error('Certification error:', error);
      toast.error(error.message || 'Failed to certify document');
    },
  });
}

export function useTransferCertificate() {
  const { contract } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      certificateId: bigint;
      newOwner: string;
      transferFee: bigint;
    }) => {
      if (!contract) throw new Error('Contract not initialized');

      const tx = await contract.transferCertificate(
        params.certificateId,
        params.newOwner,
        { value: params.transferFee }
      );

      return await tx.wait();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificate', variables.certificateId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate transferred successfully!');
    },
    onError: (error: any) => {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Failed to transfer certificate');
    },
  });
}

export function useRevokeCertificate() {
  const { contract } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      certificateId: bigint;
      reason: string;
    }) => {
      if (!contract) throw new Error('Contract not initialized');

      // Upload reason to IPFS
      const reasonIPFS = await uploadToIPFS({ reason: params.reason, timestamp: Date.now() });

      const tx = await contract.revokeCertificate(params.certificateId, reasonIPFS);
      return await tx.wait();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificate', variables.certificateId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate revoked successfully');
    },
    onError: (error: any) => {
      console.error('Revocation error:', error);
      toast.error(error.message || 'Failed to revoke certificate');
    },
  });
}

export function useMyCertificates() {
  const { contract } = useContract();
  const { account } = useWallet();

  const { data: issuedCertificates, isLoading: isLoadingIssued } = useQuery({
    queryKey: ['certificates', 'issued', account],
    queryFn: async () => {
      if (!contract || !account) return [];
      const ids = await contract.getCertificatesByIssuer(account, 0, 100);
      return ids.map((id: bigint) => id);
    },
    enabled: !!contract && !!account,
  });

  const { data: ownedCertificates, isLoading: isLoadingOwned } = useQuery({
    queryKey: ['certificates', 'owned', account],
    queryFn: async () => {
      if (!contract || !account) return [];
      const ids = await contract.getCertificatesByOwner(account, 0, 100);
      return ids.map((id: bigint) => id);
    },
    enabled: !!contract && !!account,
  });

  return {
    issuedCertificates: issuedCertificates || [],
    ownedCertificates: ownedCertificates || [],
    isLoading: isLoadingIssued || isLoadingOwned,
  };
}

export function usePlatformStats() {
  const { contract } = useContract();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['platformStats'],
    queryFn: async (): Promise<PlatformStats> => {
      if (!contract) throw new Error('Contract not initialized');
      const result = await contract.getPlatformStats();
      return {
        totalCertificates: result[0],
        totalIssuers: result[1],
        totalRevoked: result[2],
        totalPublic: result[3],
        totalPrivate: result[4],
      };
    },
    enabled: !!contract,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    stats,
    isLoading,
  };
}

export function useIssuerStats(issuer?: string) {
  const { contract } = useContract();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['issuerStats', issuer],
    queryFn: async (): Promise<IssuerStats> => {
      if (!contract || !issuer) throw new Error('Contract or issuer not provided');
      const result = await contract.getIssuerStats(issuer);
      return {
        totalIssued: result[0],
        totalRevoked: result[1],
        totalTransferred: result[2],
        certificateIds: result[3],
      };
    },
    enabled: !!contract && !!issuer,
  });

  return {
    stats,
    isLoading,
  };
}
