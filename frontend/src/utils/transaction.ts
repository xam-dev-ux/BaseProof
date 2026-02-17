import { Attribution } from "ox/erc8021";
import { Contract, JsonRpcProvider, Signer } from "ethers";

// Builder Code from base.dev
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_t0jum0me"],
});

const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';

// Always-available read provider pointing to Base mainnet
const readProvider = new JsonRpcProvider(BASE_RPC_URL);

/**
 * Adds the builder code data suffix to transaction data
 */
export function addBuilderCode(data: string): string {
  if (!data || data === '0x') {
    return DATA_SUFFIX;
  }
  const cleanData = data.startsWith('0x') ? data.slice(2) : data;
  const cleanSuffix = DATA_SUFFIX.startsWith('0x') ? DATA_SUFFIX.slice(2) : DATA_SUFFIX;
  return `0x${cleanData}${cleanSuffix}`;
}

/**
 * Wraps a contract so that:
 * - view/pure calls always use Base mainnet readProvider (avoids wrong-network 0x errors)
 * - write calls append the builder code and use the original signer
 */
export function wrapContractWithBuilderCode(contract: Contract): Contract {
  return new Proxy(contract, {
    get(target, prop) {
      const original = target[prop as keyof Contract];

      if (typeof original === 'function' && target.interface.hasFunction(prop as string)) {
        return async (...args: any[]) => {
          const fragment = target.interface.getFunction(prop as string);

          if (!fragment) {
            return original.apply(target, args);
          }

          // Read-only: always call via Base mainnet provider to avoid wrong-network errors
          if (fragment.stateMutability === 'view' || fragment.stateMutability === 'pure') {
            const address = await target.getAddress();
            const readContract = new Contract(address, target.interface, readProvider);
            return (readContract as any)[prop as string](...args);
          }

          // Write: append builder code and send via signer
          const lastArg = args[args.length - 1];
          const hasOverrides = lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg);
          const funcArgs = hasOverrides ? args.slice(0, -1) : args;
          const overrides = hasOverrides ? { ...lastArg } : {};

          const data = target.interface.encodeFunctionData(prop as string, funcArgs);
          overrides.data = addBuilderCode(data);

          const signer = target.runner as Signer;
          if (!signer || typeof signer.sendTransaction !== 'function') {
            throw new Error('Contract runner must be a Signer to send transactions');
          }

          return signer.sendTransaction({
            to: await target.getAddress(),
            data: overrides.data,
            value: overrides.value,
            gasLimit: overrides.gasLimit,
            gasPrice: overrides.gasPrice,
            maxFeePerGas: overrides.maxFeePerGas,
            maxPriorityFeePerGas: overrides.maxPriorityFeePerGas,
            nonce: overrides.nonce,
          });
        };
      }

      return original;
    },
  });
}
