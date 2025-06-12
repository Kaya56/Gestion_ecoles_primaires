// src/hooks/useToast.ts
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Hook pour utiliser le système de notifications toast
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};