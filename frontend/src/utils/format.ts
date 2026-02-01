/**
 * Format utilities for displaying blockchain data
 */

/**
 * Truncate Ethereum address for display
 * @param address Ethereum address
 * @param startChars Characters to show at start (default 6)
 * @param endChars Characters to show at end (default 4)
 * @returns Truncated address
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format ETH amount
 * @param wei Amount in wei
 * @param decimals Number of decimals to show (default 4)
 * @returns Formatted ETH string
 */
export function formatEther(wei: bigint | string, decimals = 4): string {
  const weiAmount = typeof wei === 'string' ? BigInt(wei) : wei;
  const ethAmount = Number(weiAmount) / 1e18;
  return ethAmount.toFixed(decimals);
}

/**
 * Format timestamp to readable date
 * @param timestamp Unix timestamp (seconds)
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleString();
}

/**
 * Format timestamp to date only
 * @param timestamp Unix timestamp (seconds)
 * @returns Formatted date string
 */
export function formatDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleDateString();
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param timestamp Unix timestamp (seconds)
 * @returns Relative time string
 */
export function getRelativeTime(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  const seconds = Math.floor(Date.now() / 1000 - ts);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}

/**
 * Copy text to clipboard
 * @param text Text to copy
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Get explorer URL for transaction
 * @param txHash Transaction hash
 * @returns Explorer URL
 */
export function getExplorerTxUrl(txHash: string): string {
  const explorer = import.meta.env.VITE_BASE_EXPLORER || 'https://basescan.org';
  return `${explorer}/tx/${txHash}`;
}

/**
 * Get explorer URL for address
 * @param address Ethereum address
 * @returns Explorer URL
 */
export function getExplorerAddressUrl(address: string): string {
  const explorer = import.meta.env.VITE_BASE_EXPLORER || 'https://basescan.org';
  return `${explorer}/address/${address}`;
}

/**
 * Get explorer URL for block
 * @param blockNumber Block number
 * @returns Explorer URL
 */
export function getExplorerBlockUrl(blockNumber: number): string {
  const explorer = import.meta.env.VITE_BASE_EXPLORER || 'https://basescan.org';
  return `${explorer}/block/${blockNumber}`;
}
