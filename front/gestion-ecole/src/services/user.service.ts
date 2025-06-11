// src/services/userService.ts
import { apiUtils } from './api.service';

interface User {
  id: number | string;
  email: string;
  role: string;
  active: boolean;
  [key: string]: any;
}

interface PasswordData {
  oldPassword?: string;
  newPassword: string;
  temporary?: boolean;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: { [role: string]: number };
}

const userService = {
  // CRUD Utilisateurs

  // Créer un utilisateur
  createUser: async (userData: User): Promise<any> => {
    try {
      return await apiUtils.post('/users', userData);
    } catch (error) {
      throw error;
    }
  },

  // Obtenir tous les utilisateurs avec pagination
  getUsers: async (page: number = 0, size: number = 10, sort: string = 'id'): Promise<User[]> => {
    try {
      return await apiUtils.get('/users', { page, size, sort });
    } catch (error) {
      throw error;
    }
  },

  // Obtenir un utilisateur par ID
  getUserById: async (userId: number | string): Promise<User> => {
    try {
      return await apiUtils.get(`/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (userId: number | string, userData: Partial<User>): Promise<any> => {
    try {
      return await apiUtils.put(`/users/${userId}`, userData);
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (userId: number | string): Promise<any> => {
    try {
      return await apiUtils.delete(`/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  // Gestion des mots de passe et activation

  // Changer le mot de passe
  changePassword: async (userId: number | string, passwordData: PasswordData): Promise<any> => {
    try {
      return await apiUtils.put(`/users/${userId}/password`, passwordData);
    } catch (error) {
      throw error;
    }
  },

  // Activer un utilisateur
  activateUser: async (userId: number | string): Promise<any> => {
    try {
      return await apiUtils.post(`/users/${userId}/activate`);
    } catch (error) {
      throw error;
    }
  },

  // Désactiver un utilisateur
  deactivateUser: async (userId: number | string): Promise<any> => {
    try {
      return await apiUtils.post(`/users/${userId}/deactivate`);
    } catch (error) {
      throw error;
    }
  },

  // Filtrage et recherche

  // Obtenir les utilisateurs par rôle
  getUsersByRole: async (role: string): Promise<User[]> => {
    try {
      return await apiUtils.get(`/users/role/${role}`);
    } catch (error) {
      throw error;
    }
  },

  // Fonctions utilitaires

  // Vérifier si un email existe déjà
  checkEmailExists: async (email: string, excludeUserId: number | string | null = null): Promise<boolean> => {
    try {
      const users: User[] = await apiUtils.get('/users', { email });
      if (excludeUserId) {
        return users.some((user: User) => user.email === email && user.id !== excludeUserId);
      }
      return users.some((user: User) => user.email === email);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  },

  // Obtenir les statistiques des utilisateurs
  getUserStats: async (): Promise<UserStats> => {
    try {
      const users: User[] = await apiUtils.get('/users');
      const stats: UserStats = {
        total: users.length,
        active: users.filter((user: User) => user.active).length,
        inactive: users.filter((user: User) => !user.active).length,
        byRole: {}
      };

      // Compter par rôle
      users.forEach((user: User) => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw error;
    }
  },

  // Réinitialiser le mot de passe (génère un nouveau mot de passe temporaire)
  resetPassword: async (userId: number | string): Promise<any> => {
    try {
      const tempPassword = Math.random().toString(36).slice(-8);
      const response = await apiUtils.put(`/users/${userId}/password`, {
        newPassword: tempPassword,
        temporary: true
      });
      return { ...response, tempPassword };
    } catch (error) {
      throw error;
    }
  },
};

export default userService;