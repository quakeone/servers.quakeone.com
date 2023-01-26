/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVERS_API: string
  readonly VITE_THUMBNAILS_PATH: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}