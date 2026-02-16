import { Attribution } from "ox/erc8021";
import { Contract, Signer } from "ethers";

// Builder Code from base.dev
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_t0jum0me"],
});

/**
 * Adds the builder code data suffix to transaction data
 */
export function addBuilderCode(data: string): string {
  if (!data || data === '0x') {
    return DATA_SUFFIX;
  }

  // Remove '0x' prefix from data if present
  const cleanData = data.startsWith('0x') ? data.slice(2) : data;
  const cleanSuffix = DATA_SUFFIX.startsWith('0x') ? DATA_SUFFIX.slice(2) : DATA_SUFFIX;

  return `0x${cleanData}${cleanSuffix}`;
}

/**
 * Wraps a contract to automatically add builder code to all transactions
 */
export function wrapContractWithBuilderCode(contract: Contract): Contract {
  // Create a proxy that intercepts contract method calls
  return new Proxy(contract, {
    get(target, prop) {
      const original = target[prop as keyof Contract];

      // If it's a function from the contract interface
      if (typeof original === 'function' && target.interface.hasFunction(prop as string)) {
        return async (...args: any[]) => {
          // Get the function fragment
          const fragment = target.interface.getFunction(prop as string);

          if (!fragment) {
            return original.apply(target, args);
          }

          // Check if this is a state-changing function (not view/pure)
          if (fragment.stateMutability === 'view' || fragment.stateMutability === 'pure') {
            // For read-only functions, just call normally
            return original.apply(target, args);
          }

          // For write functions, we need to add the data suffix
          // The last argument might be the transaction overrides
          const lastArg = args[args.length - 1];
          const hasOverrides = lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg);

          // Prepare new args with modified data in overrides
          const funcArgs = hasOverrides ? args.slice(0, -1) : args;
          const overrides = hasOverrides ? { ...lastArg } : {};

          // Encode the function call
          const data = target.interface.encodeFunctionData(prop as string, funcArgs);

          // Add builder code to the data
          overrides.data = addBuilderCode(data);

          // Get the signer from the contract runner
          const signer = target.runner as Signer;
          if (!signer || typeof signer.sendTransaction !== 'function') {
            throw new Error('Contract runner must be a Signer to send transactions');
          }

          // Send transaction with modified data
          const tx = await signer.sendTransaction({
            to: await target.getAddress(),
            data: overrides.data,
            value: overrides.value,
            gasLimit: overrides.gasLimit,
            gasPrice: overrides.gasPrice,
            maxFeePerGas: overrides.maxFeePerGas,
            maxPriorityFeePerGas: overrides.maxPriorityFeePerGas,
            nonce: overrides.nonce,
          });

          return tx;
        };
      }

      return original;
    },
  });
}
