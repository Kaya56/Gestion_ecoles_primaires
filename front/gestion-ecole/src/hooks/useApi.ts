// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';

type ApiFunction<T = any, A extends any[] = any[]> = (...args: A) => Promise<T>;

interface UseApiOptions {
  immediate?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiReturn<T, A extends any[]> {
  data: T | null;
  loading: boolean;
  error: any;
  execute: (...args: A) => Promise<T>;
  refetch: () => Promise<T>;
}

/**
 * Hook générique pour gérer les appels API
 */
export function useApi<T = any, A extends any[] = any[]>(
  apiFunction: ApiFunction<T, A>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
): UseApiReturn<T, A> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { showToast } = useToast();

  const {
    immediate = true,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Opération réussie',
    errorMessage = 'Une erreur est survenue'
  } = options;

  const execute = useCallback(async (...args: A): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFunction(...args);
      setData(result);

      if (showSuccessToast) {
        showToast(successMessage, 'success');
      }

      return result;
    } catch (err: any) {
      setError(err);

      if (showErrorToast) {
        // Adaptation à la structure d'erreur de votre api.service.ts
        const message = err?.message || errorMessage;
        showToast(message, 'error');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, showSuccessToast, showErrorToast, successMessage, errorMessage, showToast]);

  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as A));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(() => execute(...([] as unknown as A)), [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
}

interface UseApiListOptions {
  page?: number;
  size?: number;
  sort?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

interface PaginatedResult<T> {
  content: T[];
  totalElements: number;
  [key: string]: any;
}

interface UseApiListReturn<T> {
  data: T[];
  totalItems: number;
  loading: boolean;
  error: any;
  execute: (params?: Record<string, any>) => Promise<any>;
  refetch: (params?: Record<string, any>) => Promise<any>;
}

/**
 * Hook pour gérer les listes avec pagination côté serveur
 */
export function useApiList<T = any>(
  apiFunction: (params: Record<string, any>) => Promise<PaginatedResult<T> | T[]>,
  dependencies: any[] = [],
  options: UseApiListOptions = {}
): UseApiListReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { showToast } = useToast();

  const {
    page = 0,
    size = 10,
    sort = '',
    showErrorToast = true,
    errorMessage = 'Erreur lors du chargement des données'
  } = options;

  const execute = useCallback(async (params: Record<string, any> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page,
        size,
        sort,
        ...params
      };

      const result = await apiFunction(queryParams);

      if (result && typeof result === 'object' && 'content' in result && Array.isArray(result.content)) {
        setData(result.content);
        setTotalItems(result.totalElements ?? result.content.length);
      } else if (Array.isArray(result)) {
        setData(result);
        setTotalItems(result.length);
      } else {
        setData([]);
        setTotalItems(0);
      }

      return result;
    } catch (err: any) {
      setError(err);

      if (showErrorToast) {
        // Adaptation à la structure d'erreur de votre api.service.ts
        const message = err?.message || errorMessage;
        showToast(message, 'error');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, size, sort, showErrorToast, errorMessage, showToast]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback((params?: Record<string, any>) => execute(params), [execute]);

  return {
    data,
    totalItems,
    loading,
    error,
    execute,
    refetch
  };
}

interface CrudService<T = any> {
  create: (data: T) => Promise<any>;
  update: (id: string | number, data: T) => Promise<any>;
  delete: (id: string | number) => Promise<any>;
  getById: (id: string | number) => Promise<T>;
}

interface UseApiCrudOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface UseApiCrudReturn<T> {
  loading: boolean;
  error: any;
  create: (data: T) => Promise<any>;
  update: (id: string | number, data: T) => Promise<any>;
  remove: (id: string | number) => Promise<any>;
  getById: (id: string | number) => Promise<T>;
}

/**
 * Hook pour gérer les opérations CRUD
 */
export function useApiCrud<T = any>(
  service: CrudService<T>,
  options: UseApiCrudOptions = {}
): UseApiCrudReturn<T> {
  const { showToast } = useToast();
  const {
    showSuccessToast = true,
    showErrorToast = true
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const executeOperation = useCallback(async (operation: (...args: any[]) => Promise<any>, ...args: any[]) => {
    try {
      setLoading(true);
      setError(null);

      const result = await operation(...args);

      if (showSuccessToast) {
        showToast('Opération réussie', 'success');
      }

      return result;
    } catch (err: any) {
      setError(err);

      if (showErrorToast) {
        // Adaptation à la structure d'erreur de votre api.service.ts
        const message = err?.message || 'Une erreur est survenue';
        showToast(message, 'error');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccessToast, showErrorToast, showToast]);

  const create = useCallback((data: T) => executeOperation(service.create, data), [executeOperation, service.create]);
  const update = useCallback((id: string | number, data: T) => executeOperation(service.update, id, data), [executeOperation, service.update]);
  const remove = useCallback((id: string | number) => executeOperation(service.delete, id), [executeOperation, service.delete]);
  const getById = useCallback((id: string | number) => executeOperation(service.getById, id), [executeOperation, service.getById]);

  return {
    loading,
    error,
    create,
    update,
    remove,
    getById
  };
}