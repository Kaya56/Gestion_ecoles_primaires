import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, isAuthenticated, hasRole, hasAnyRole } = context;

  type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'STAFF' | string;

  // Helpers supplémentaires
  const isAdmin = (): boolean => user?.role === 'ADMIN';
  const isTeacher = (): boolean => user?.role === 'TEACHER';
  const isStudent = (): boolean => user?.role === 'STUDENT';
  const isStaff = (): boolean => user?.role === 'STAFF';
  const canAccess = (allowedRoles: Role[]): boolean =>
    !!user && allowedRoles.includes(user.role);

  return {
    ...context,
    isAdmin,
    isTeacher,
    isStudent,
    isStaff,
    canAccess,
  };
};