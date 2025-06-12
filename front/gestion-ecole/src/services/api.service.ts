// src/services/api.service.ts
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration de base de l'API
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Instance Axios principale
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instance pour les uploads de fichiers
const apiUpload: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
import type { InternalAxiosRequestConfig } from 'axios';

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
apiUpload.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));

// Intercepteur de réponse pour gérer les erreurs globalement
const handleResponseError = (error: AxiosError) => {
  if (error.response) {
    const { status, data } = error.response as AxiosResponse<any>;
    switch (status) {
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Accès refusé:', data?.message);
        break;
      case 404:
        console.error('Ressource non trouvée:', data?.message);
        break;
      case 500:
        console.error('Erreur serveur:', data?.message);
        break;
      default:
        console.error('Erreur API:', data?.message || 'Erreur inconnue');
    }
    return Promise.reject({
      status,
      message: data?.message || 'Erreur inconnue',
      errors: data?.errors || [],
    });
  } else if (error.request) {
    console.error('Erreur réseau:', error.message);
    return Promise.reject({
      status: 0,
      message: 'Erreur de connexion au serveur',
      errors: [],
    });
  } else {
    console.error('Erreur:', error.message);
    return Promise.reject({
      status: 0,
      message: error.message,
      errors: [],
    });
  }
};

api.interceptors.response.use((response) => response, handleResponseError);
apiUpload.interceptors.response.use((response) => response, handleResponseError);

// Fonctions utilitaires pour les appels API
export const apiUtils = {
  get: async <T = any>(url: string, params: Record<string, any> = {}): Promise<T> => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  post: async <T = any>(url: string, data: any = {}): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  put: async <T = any>(url: string, data: any = {}): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  delete: async <T = any>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },

  upload: async <T = any>(url: string, formData: FormData): Promise<T> => {
    const response = await apiUpload.post<T>(url, formData);
    return response.data;
  },

  download: async (url: string, filename?: string): Promise<boolean> => {
    const response = await api.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  },
};



// Export des instances axios pour usage direct si nécessaire
export { api, apiUpload };
export default api;
