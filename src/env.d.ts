/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WALLET_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
