import { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { BASE_PROOF_ABI } from '@/contracts/BaseProofABI';
import { useWallet } from './useWallet';
import { wrapContractWithBuilderCode } from '@/utils/transaction';

const CONTRACT_ADDRESS = import.meta.env.VITE_PROOF_CONTRACT_ADDRESS;

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
          // Wrap the contract to automatically add builder code to all transactions
          const wrappedContract = wrapContractWithBuilderCode(contractInstance);
          setContract(wrappedContract);
        }
      });
    } else {
      setContract(null);
    }
  }, [signer, isConnected]);

  return {
    contract,
    contractAddress: CONTRACT_ADDRESS,
  };
}
