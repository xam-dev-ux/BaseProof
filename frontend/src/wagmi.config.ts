import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { Attribution } from "ox/erc8021";
import { injected } from "wagmi/connectors";

const BASE_CHAIN_ID = import.meta.env.VITE_BASE_CHAIN_ID || '8453';
const isMainnet = BASE_CHAIN_ID === '8453';

// Builder Code from base.dev
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_t0jum0me"],
});

export const config = createConfig({
  chains: isMainnet ? [base] : [baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});
