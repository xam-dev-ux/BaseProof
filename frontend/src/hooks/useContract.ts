import { useMemo } from 'react';
import { Contract } from 'ethers';
import { BASE_PROOF_ABI } from '@/contracts/BaseProofABI';
import { useWallet } from './useWallet';

const CONTRACT_ADDRESS = import.meta.env.VITE_PROOF_CONTRACT_ADDRESS;

export function useContract() {
  const { signer, provider } = useWallet();

  const contract = useMemo(() => {
    if (!CONTRACT_ADDRESS) {
      console.warn('Contract address not configured');
      return null;
    }

    if (signer) {
      return new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, signer);
    }

    if (provider) {
      return new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, provider);
    }

    return null;
  }, [signer, provider]);

  return {
    contract,
    contractAddress: CONTRACT_ADDRESS,
  };
}
