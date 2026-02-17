import { Attribution } from "ox/erc8021";
import { ethers } from "ethers";

// Builder Code from base.dev
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_t0jum0me"],
});

/**
 * Appends the builder code suffix to existing transaction data
 */
export function addBuilderCode(data: string): string {
  if (!data || data === '0x') return DATA_SUFFIX;
  const cleanData = data.startsWith('0x') ? data.slice(2) : data;
  const cleanSuffix = DATA_SUFFIX.startsWith('0x') ? DATA_SUFFIX.slice(2) : DATA_SUFFIX;
  return `0x${cleanData}${cleanSuffix}`;
}

/**
 * Patches a signer so that every sendTransaction call automatically
 * appends the builder code to the transaction data.
 * This approach works reliably with ethers v6 regardless of how
 * the transaction is initiated (direct or via Contract).
 */
export function patchSignerWithBuilderCode(signer: ethers.Signer): ethers.Signer {
  const original = signer.sendTransaction.bind(signer);

  // Monkey-patch sendTransaction on the signer instance
  (signer as any).sendTransaction = async (tx: ethers.TransactionRequest) => {
    if (tx.data && tx.data !== '0x' && typeof tx.data === 'string') {
      tx = { ...tx, data: addBuilderCode(tx.data) };
    }
    return original(tx);
  };

  return signer;
}
