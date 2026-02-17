import { useMemo } from 'react';
import { Contract, JsonRpcProvider } from 'ethers';
import { BASE_PROOF_ABI } from '@/contracts/BaseProofABI';
import { useWallet } from './useWallet';
import { wrapContractWithBuilderCode } from '@/utils/transaction';

const CONTRACT_ADDRESS = import.meta.env.VITE_PROOF_CONTRACT_ADDRESS;
const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';

// Read-only fallback always pointing to Base mainnet
const readProvider = new JsonRpcProvider(BASE_RPC_URL);

export function useContract() {
  const { signer, provider } = useWallet();

  const contract = useMemo(() => {
    if (!CONTRACT_ADDRESS) {
      console.warn('Contract address not configured');
      return null;
    }

    if (signer) {
      const c = new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, signer);
      return wrapContractWithBuilderCode(c);
    }

    if (provider) {
      return new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, provider);
    }

    // Fallback: read-only via Base mainnet RPC
    return new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, readProvider);
  }, [signer, provider]);

  return {
    contract,
    contractAddress: CONTRACT_ADDRESS,
  };
}
