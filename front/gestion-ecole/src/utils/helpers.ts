// Utilitaires fusionnés pour l'application de gestion scolaire

// === FORMATAGE DE DATES ===
export const formatDate = (date: Date | string | number, format: string = 'DD/MM/YYYY'): string => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Date invalide';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const formats: Record<string, string> = {
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD/MM/YYYY HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
    'YYYY-MM-DDTHH:mm:ss': d.toISOString().slice(0, 19),
    'DD MMM YYYY': (() => {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      return `${day} ${months[d.getMonth()]} ${year}`;
    })()
  };

  return formats[format] || formats['DD/MM/YYYY'];
};

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const getCurrentAcademicYear = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 9 ? year : year - 1;
};

export const calculateAge = (birthDate: Date | string): number => {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const today = new Date();
  if (isNaN(birth.getTime())) return 0;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// === FORMATAGE NUMÉRIQUE ET MONÉTAIRE ===
export const formatCurrency = (amount: number, currency: string = 'FCFA'): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return `0 ${currency}`;
  
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  
  return `${formatted} ${currency}`;
};

export const formatNumber = (number: number, decimals: number = 2): string => {
  if (number === null || number === undefined || isNaN(number)) return '';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// === VALIDATION ===
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Formats acceptés: +237xxxxxxxxx, 237xxxxxxxxx, 6xxxxxxxx, 2xxxxxxxx
  const phoneRegex = /^(\+?237)?[62][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidMatricule = (matricule: string): boolean => {
  const matriculeRegex = /^[A-Z0-9]{6,10}$/;
  return matriculeRegex.test(matricule);
};

// === FORMATAGE DE CHAÎNES ===
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

export const truncate = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprimer les tirets en début et fin
};

export const getFullName = (firstName?: string, lastName?: string): string => {
  return [firstName, lastName].filter(Boolean).join(' ');
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// === TÉLÉPHONE ===
export const cleanPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('6') || cleaned.startsWith('2')) {
    cleaned = '237' + cleaned;
  }
  
  if (cleaned.startsWith('237') && !cleaned.startsWith('+237')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('237')) {
    const number = cleaned.substring(3);
    return `+237 ${number.substring(0, 1)} ${number.substring(1, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }

  if (cleaned.length === 9) {
    return `+237 ${cleaned.substring(0, 1)} ${cleaned.substring(1, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }

  return phone;
};

// === GÉNÉRATION ===
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const generateMatricule = (prefix: string = 'STU'): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${random}`;
};

export const generatePassword = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Assurer au moins un caractère de chaque type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  for (let i = password.length; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const generateRandomColor = (): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// === CALCULS SCOLAIRES ===
type Grade = { value: number };

export const calculateAverage = (grades: number[] | Grade[], coefficients?: number[]): number => {
  if (!grades || grades.length === 0) return 0;
  
  const values = Array.isArray(grades) && typeof grades[0] === 'object' 
    ? (grades as Grade[]).map(g => g.value || 0)
    : grades as number[];
  
  if (coefficients && coefficients.length === values.length) {
    const totalPoints = values.reduce((sum, grade, index) => sum + (grade * coefficients[index]), 0);
    const totalCoeff = coefficients.reduce((sum, coeff) => sum + coeff, 0);
    return totalCoeff > 0 ? Math.round((totalPoints / totalCoeff) * 100) / 100 : 0;
  }
  
  const sum = values.reduce((acc, grade) => acc + grade, 0);
  return Math.round((sum / values.length) * 100) / 100;
};

export const getGradeColor = (grade: number): string => {
  if (grade >= 16) return 'text-green-600';
  if (grade >= 14) return 'text-blue-600';
  if (grade >= 12) return 'text-yellow-600';
  if (grade >= 10) return 'text-orange-600';
  return 'text-red-600';
};

export const getGradeStatus = (grade: number): 'PASS' | 'FAIL' => {
  return grade >= 10 ? 'PASS' : 'FAIL';
};

// === FICHIERS ===
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

export const isAllowedFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// === UTILITAIRES FONCTIONNELS ===
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = <T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void => {
  let inThrottle = false;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// === MANIPULATION D'OBJETS ===
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as any;
  const clonedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone((obj as any)[key]);
    }
  }
  return clonedObj;
};

export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEqual(obj1[key], obj2[key])) return false;
    }
    return true;
  }
  
  return false;
};

// === MANIPULATION DE TABLEAUX ===
export const sortBy = <T>(array: T[], property: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const groupBy = <T, K extends keyof T>(array: T[], property: K): Record<string, T[]> => {
  return array.reduce((groups: Record<string, T[]>, item) => {
    const key = String(item[property]);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

export const filterBySearch = <T>(array: T[], searchTerm: string, searchFields: (keyof T)[]): T[] => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      if (typeof value === 'number') {
        return value.toString().includes(term);
      }
      return false;
    });
  });
};

export const paginate = <T>(array: T[], page: number, size: number) => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  return {
    data: array.slice(startIndex, endIndex),
    totalElements: array.length,
    totalPages: Math.ceil(array.length / size),
    currentPage: page,
    size: size
  };
};

// === AUTORISATIONS ===
export const hasRole = (userRoles: string[] | string, requiredRoles: string[]): boolean => {
  if (!userRoles || !requiredRoles) return false;
  if (Array.isArray(userRoles)) {
    return requiredRoles.some(role => userRoles.includes(role));
  }
  return requiredRoles.includes(userRoles);
};

// === NAVIGATION ===
export const getRoutePath = (path: string, params: Record<string, string | number> = {}): string => {
  let result = path;
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, String(params[key]));
  });
  return result;
};

// === UTILITAIRES NAVIGATEUR ===
export const downloadFile = (data: BlobPart, filename: string, type: string = 'application/octet-stream'): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};

export const getQueryParams = (url: string = window.location.search): Record<string, string> => {
  const params = new URLSearchParams(url.startsWith('?') ? url : `?${url}`);
  const result: Record<string, string> = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, String(params[key]));
    }
  });
  return searchParams.toString();
};

// Export par défaut avec les fonctions les plus utilisées
export default {
  // Formatage
  formatDate,
  formatCurrency,
  formatNumber,
  formatPhone,
  formatFileSize,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidMatricule,
  
  // Génération
  generateId,
  generateMatricule,
  generatePassword,
  
  // Calculs
  calculateAge,
  calculateAverage,
  
  // Chaînes
  capitalize,
  capitalizeWords,
  truncate,
  slugify,
  getFullName,
  getInitials,
  
  // Tableaux
  sortBy,
  groupBy,
  filterBySearch,
  paginate,
  
  // Utilitaires
  debounce,
  isEmpty,
  deepClone,
  hasRole
};