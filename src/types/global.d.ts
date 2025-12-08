 
// Global type definitions for missing modules



declare module 'virtual:pwa-register' {
  export function registerSW(options?: unknown): unknown;
}

// Global environment variables
declare module '@env' {
  export const VITE_CONNECT_BASE_URL: string;
  export const VITE_MAPBOX_API_KEY: string;
}

// Utility types for the project
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// JSX namespace for SolidJS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: unknown;
  }
}

export { };