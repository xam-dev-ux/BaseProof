/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROOF_CONTRACT_ADDRESS: string
  readonly VITE_BASE_RPC_URL: string
  readonly VITE_BASE_CHAIN_ID: string
  readonly VITE_BASE_EXPLORER: string
  readonly VITE_WEB3_STORAGE_TOKEN: string
  readonly VITE_IPFS_GATEWAY: string
  readonly VITE_CERTIFICATION_FEE: string
  readonly VITE_TRANSFER_FEE: string
  readonly VITE_ENABLE_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
