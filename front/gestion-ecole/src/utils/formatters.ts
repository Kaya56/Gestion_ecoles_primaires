/**
 * Utilitaires de formatage pour l'application de gestion académique
 */

// Formatage des dates
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateForInput = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Formatage des montants
export const formatCurrency = (amount: number): string => {
  if (amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('XAF', 'FCFA');
};

export const formatNumber = (num: number): string => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Formatage des notes
export const formatGrade = (grade: number): string => {
  if (grade === null || grade === undefined) return '-';
  return grade.toFixed(2);
};

export const getGradeClass = (grade: number): string => {
  if (grade >= 16) return 'text-green-600 font-semibold';
  if (grade >= 14) return 'text-blue-600 font-medium';
  if (grade >= 12) return 'text-yellow-600';
  if (grade >= 10) return 'text-orange-600';
  return 'text-red-600 font-medium';
};

export const getGradeStatus = (grade: number): string => {
  if (grade >= 16) return 'Excellent';
  if (grade >= 14) return 'Très bien';
  if (grade >= 12) return 'Bien';
  if (grade >= 10) return 'Assez bien';
  return 'Insuffisant';
};

// Formatage des noms
export const formatFullName = (firstName: string, lastName: string): string => {
  if (!firstName && !lastName) return '';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

export const formatInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0).toUpperCase() || '';
  const last = lastName?.charAt(0).toUpperCase() || '';
  return `${first}${last}`;
};

// Formatage des numéros de téléphone
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  // Supprimer tous les espaces et caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Format camerounais: 6XX XX XX XX
  if (cleaned.length === 9 && cleaned.startsWith('6')) {
    return `6${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
  }
  
  // Format avec indicatif: +237 6XX XX XX XX
  if (cleaned.length === 12 && cleaned.startsWith('237')) {
    const number = cleaned.slice(3);
    return `+237 6${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
  }
  
  return phone; // Retourner tel quel si format non reconnu
};

// Formatage des sections et classes
export const formatSection = (section: string): string => {
  const sectionMap: Record<string, string> = {
    'MATERNAL': 'Maternelle',
    'PRIMARY': 'Primaire',
    'SECONDARY': 'Secondaire',
    'FRANCOPHONE': 'Francophone',
    'ANGLOPHONE': 'Anglophone'
  };
  return sectionMap[section] || section;
};

export const formatClass = (className: string): string => {
  return className.replace('_', ' ').toUpperCase();
};

// Formatage des statuts
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'Actif',
    'INACTIVE': 'Inactif',
    'PENDING': 'En attente',
    'COMPLETED': 'Terminé',
    'CANCELLED': 'Annulé',
    'RESOLVED': 'Résolu',
    'UNRESOLVED': 'Non résolu',
    'PAID': 'Payé',
    'UNPAID': 'Non payé',
    'PARTIAL': 'Partiel'
  };
  return statusMap[status] || status;
};

export const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'INACTIVE': 'bg-gray-100 text-gray-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-blue-100 text-blue-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'UNRESOLVED': 'bg-red-100 text-red-800',
    'PAID': 'bg-green-100 text-green-800',
    'UNPAID': 'bg-red-100 text-red-800',
    'PARTIAL': 'bg-yellow-100 text-yellow-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Formatage des pourcentages
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(1)}%`;
};

// Formatage des tailles de fichier
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Formatage des rôles utilisateur
export const formatUserRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'ADMIN': 'Administrateur',
    'DIRECTOR': 'Directeur',
    'TEACHER': 'Enseignant',
    'SECRETARY': 'Secrétaire',
    'ACCOUNTANT': 'Comptable',
    'STUDENT': 'Élève',
    'PARENT': 'Parent'
  };
  return roleMap[role] || role;
};

// Utilitaire pour tronquer le texte
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Formatage des âges
export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const formatAge = (birthDate: string | Date): string => {
  const age = calculateAge(birthDate);
  return `${age} ans`;
};