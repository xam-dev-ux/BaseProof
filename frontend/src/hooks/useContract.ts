import { useState, useEffect } from 'react';
import { Contract, JsonRpcProvider } from 'ethers';
import { BASE_PROOF_ABI } from '@/contracts/BaseProofABI';
import { useWallet } from './useWallet';
import { wrapContractWithBuilderCode } from '@/utils/transaction';

const CONTRACT_ADDRESS = import.meta.env.VITE_PROOF_CONTRACT_ADDRESS;
const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';

// Fallback read-only provider always pointing to Base mainnet
const readProvider = new JsonRpcProvider(BASE_RPC_URL);

export function useContract() {
  const { signer, isConnected } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!CONTRACT_ADDRESS) {
      console.warn('Contract address not configured');
      setContract(null);
      return;
    }

    if (isConnected && signer) {
      signer().then((s) => {
        if (s) {
          const contractInstance = new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, s);
          setContract(wrapContractWithBuilderCode(contractInstance));
        } else {
          // Fallback to read-only
          setContract(new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, readProvider));
        }
      }).catch(() => {
        setContract(new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, readProvider));
      });
    } else {
      // Not connected: read-only provider
      setContract(new Contract(CONTRACT_ADDRESS, BASE_PROOF_ABI, readProvider));
    }
  }, [signer, isConnected]);

  return {
    contract,
    contractAddress: CONTRACT_ADDRESS,
  };
}
