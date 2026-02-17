import { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';

const BASE_CHAIN_ID = import.meta.env.VITE_BASE_CHAIN_ID || '8453';

export function useWallet() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return;
    try {
      const p = new BrowserProvider(window.ethereum);
      const accounts = await p.listAccounts();
      if (accounts.length > 0) {
        const s = await p.getSigner();
        const network = await p.getNetwork();
        setProvider(p);
        setSigner(s);
        setAccount(accounts[0].address);
        setChainId(network.chainId.toString());
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const p = new BrowserProvider(window.ethereum);
      await p.send('eth_requestAccounts', []);
      const s = await p.getSigner();
      const address = await s.getAddress();
      const network = await p.getNetwork();
      setProvider(p);
      setSigner(s);
      setAccount(address);
      setChainId(network.chainId.toString());
      if (network.chainId.toString() !== BASE_CHAIN_ID) {
        await switchToBaseNetwork();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToBaseNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(BASE_CHAIN_ID).toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(BASE_CHAIN_ID).toString(16)}`,
              chainName: 'Base',
              nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
              rpcUrls: [import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org'],
              blockExplorerUrls: [import.meta.env.VITE_BASE_EXPLORER || 'https://basescan.org'],
            }],
          });
        } catch (addError) {
          setError('Failed to add Base network');
        }
      } else {
        setError('Failed to switch to Base network');
      }
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) disconnectWallet();
    else setAccount(accounts[0]);
  };

  const handleChainChanged = () => { window.location.reload(); };

  return {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    error,
    isCorrectNetwork,
    isConnected: !!account,
    connectWallet,
    disconnectWallet,
    switchToBaseNetwork,
  };
}

declare global {
  interface Window { ethereum?: any; }
}
