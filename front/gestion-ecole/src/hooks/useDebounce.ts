// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Hook pour débouncer une valeur
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook pour débouncer une fonction
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  dependencies: any[] = []
): (() => T) | null {
  const [debouncedCallback, setDebouncedCallback] = useState<(() => T) | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies, delay]);

  return debouncedCallback;
};