// src/services/auth.service.ts
import { apiUtils } from './api.service';

export interface User {
  id: string;
  role: string;
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  [key: string]: any;
}

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

const authService = {
  // Connexion utilisateur
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiUtils.post<LoginResponse>('/users/login', credentials);

      if (response.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return !!(token && user);
  },

  // Obtenir le token actuel
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Obtenir les informations de l'utilisateur connecté
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        return null;
      }
    }
    return null;
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return !!user && user.role === role;
  },

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  hasAnyRole: (roles: string[]): boolean => {
    const user = authService.getCurrentUser();
    return !!user && roles.includes(user.role);
  },

  // Vérifier les permissions selon le rôle
  canAccess: (requiredRoles: string[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const user = authService.getCurrentUser();
    if (!user) {
      return false;
    }
    return requiredRoles.includes(user.role);
  },

  // Actualiser les données utilisateur
  refreshUser: async (): Promise<User | null> => {
    try {
      const user = authService.getCurrentUser();
      if (user && user.id) {
        const updatedUser = await apiUtils.get<User>(`/users/${user.id}`);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'actualisation des données utilisateur:', error);
      return null;
    }
  },

  // Changer le mot de passe
  changePassword: async (userId: string, passwordData: { oldPassword: string; newPassword: string }): Promise<any> => {
    try {
      const response = await apiUtils.put(`/users/${userId}/password`, passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;