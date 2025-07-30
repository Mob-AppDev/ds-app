import { useEffect } from 'react';

/**
 * Hook to signal framework readiness
 * Used across all implementations for proper initialization
 */
declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  });
}