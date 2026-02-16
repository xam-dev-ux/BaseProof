import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useEffect } from 'react';
import { BrowserProvider } from 'ethers';

const BASE_CHAIN_ID = import.meta.env.VITE_BASE_CHAIN_ID || '8453';

export function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const chainId = useAccount().chainId?.toString() || null;
  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

  // Auto-connect if previously connected
  useEffect(() => {
    const connector = connectors[0];
    if (connector) {
      connector.getProvider().then((provider: any) => {
        if (provider?.selectedAddress) {
          // Already connected, just get the account
        }
      });
    }
  }, [connectors]);

  const connectWallet = async () => {
    const connector = connectors[0];
    if (connector) {
      try {
        connect({ connector });
      } catch (err) {
        console.error('Error connecting wallet:', err);
      }
    }
  };

  const switchToBaseNetwork = async () => {
    try {
      const targetChainId = parseInt(BASE_CHAIN_ID);
      await switchChain({ chainId: targetChainId });
    } catch (err) {
      console.error('Error switching to Base network:', err);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  // Get provider and signer for ethers compatibility
  const getProvider = async () => {
    if (!connector) return null;
    const provider = await connector.getProvider();
    return new BrowserProvider(provider as any);
  };

  const getSigner = async () => {
    const provider = await getProvider();
    if (!provider) return null;
    return await provider.getSigner();
  };

  return {
    provider: getProvider,
    signer: getSigner,
    account: address || null,
    chainId,
    isConnecting,
    error: connectError?.message || null,
    isCorrectNetwork,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchToBaseNetwork,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
