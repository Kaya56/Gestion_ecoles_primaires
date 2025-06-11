import { isValidEmail, isValidPhone } from './helpers';
import { SECTIONS, LANGUAGES, USER_ROLES, PAYMENT_TYPES, DISCIPLINE_TYPES } from './constants';

// Base validation rules
export const required = (value) => {
  if (value === null || value === undefined) return 'Ce champ est requis';
  if (typeof value === 'string' && value.trim().length === 0) return 'Ce champ est requis';
  if (Array.isArray(value) && value.length === 0) return 'Ce champ est requis';
  return null;
};

export const minLength = (min) => (value) => {
  if (!value) return null;
  if (value.length < min) return `Minimum ${min} caractères requis`;
  return null;
};

export const maxLength = (max) => (value) => {
  if (!value) return null;
  if (value.length > max) return `Maximum ${max} caractères autorisés`;
  return null;
};

export const email = (value) => {
  if (!value) return null;
  if (!isValidEmail(value)) return 'Email invalide';
  return null;
};

export const phone = (value) => {
  if (!value) return null;
  if (!isValidPhone(value)) return 'Numéro de téléphone invalide';
  return null;
};

export const number = (value) => {
  if (!value && value !== 0) return null;
  if (isNaN(value)) return 'Doit être un nombre';
  return null;
};

export const min = (minValue) => (value) => {
  if (!value && value !== 0) return null;
  if (parseFloat(value) < minValue) return `Doit être supérieur ou égal à ${minValue}`;
  return null;
};

export const max = (maxValue) => (value) => {
  if (!value && value !== 0) return null;
  if (parseFloat(value) > maxValue) return `Doit être inférieur ou égal à ${maxValue}`;
  return null;
};

export const integer = (value) => {
  if (!value && value !== 0) return null;
  if (!Number.isInteger(parseFloat(value))) return 'Doit être un nombre entier';
  return null;
};

export const positive = (value) => {
  if (!value && value !== 0) return null;
  if (parseFloat(value) <= 0) return 'Doit être un nombre positif';
  return null;
};

export const date = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  return null;
};

export const pastDate = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  if (dateObj > new Date()) return 'La date doit être dans le passé';
  return null;
};

export const futureDate = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  if (dateObj < new Date()) return 'La date doit être dans le futur';
  return null;
};

export const oneOf = (options) => (value) => {
  if (!value) return null;
  if (!options.includes(value)) return `Doit être une des valeurs: ${options.join(', ')}`;
  return null;
};

export const grade = (value) => {
  if (!value && value !== 0) return null;
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'Doit être un nombre';
  if (numValue < 0 || numValue > 20) return 'La note doit être entre 0 et 20';
  return null;
};

export const matricule = (value) => {
  if (!value) return null;
  const matriculeRegex = /^[A-Z0-9]{6,10}$/;
  if (!matriculeRegex.test(value)) return 'Matricule invalide (6-10 caractères alphanumériques)';
  return null;
};

// Validation function composer
export const validate = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

// Validate entire form
export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const error = validate(data[field], rules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Validation schemas for different entities

// Student validation schema
export const studentSchema = {
  firstName: [required, minLength(2), maxLength(50)],
  lastName: [required, minLength(2), maxLength(50)],
  email: [email],
  phone: [phone],
  birthDate: [required, date, pastDate],
  address: [maxLength(200)],
  section: [required, oneOf(Object.values(SECTIONS))],
  language: [required, oneOf(Object.values(LANGUAGES))],
  parentFirstName: [required, minLength(2), maxLength(50)],
  parentLastName: [required, minLength(2), maxLength(50)],
  parentPhone: [required, phone],
  parentEmail: [email],
  matricule: [matricule]
};

// Teacher validation schema
export const teacherSchema = {
  firstName: [required, minLength(2), maxLength(50)],
  lastName: [required, minLength(2), maxLength(50)],
  email: [required, email],
  phone: [required, phone],
  address: [maxLength(200)],
  specialization: [required, minLength(2), maxLength(100)],
  hireDate: [required, date],
  salary: [number, positive]
};

// Class validation schema
export const classSchema = {
  name: [required, minLength(2), maxLength(50)],
  section: [required, oneOf(Object.values(SECTIONS))],
  language: [required, oneOf(Object.values(LANGUAGES))],
  capacity: [required, integer, positive],
  academicYear: [required, integer, min(2020)]
};

// Subject validation schema
export const subjectSchema = {
  name: [required, minLength(2), maxLength(100)],
  code: [required, minLength(2), maxLength(10)],
  coefficient: [required, number, positive],
  section: [required, oneOf(Object.values(SECTIONS))]
};

// Grade validation schema
export const gradeSchema = {
  studentId: [required, integer, positive],
  subjectId: [required, integer, positive],
  value: [required, grade],
  semester: [required, oneOf(['FIRST', 'SECOND'])],
  academicYear: [required, integer, min(2020)],
  examType: [required, minLength(2), maxLength(50)]
};

// Payment validation schema
export const paymentSchema = {
  studentId: [required, integer, positive],
  amount: [required, number, positive],
  paymentType: [required, oneOf(Object.values(PAYMENT_TYPES))],
  paymentDate: [required, date],
  description: [maxLength(200)]
};

// Discipline validation schema
export const disciplineSchema = {
  studentId: [required, integer, positive],
  type: [required, oneOf(Object.values(DISCIPLINE_TYPES))],
  description: [required, minLength(10), maxLength(500)],
  date: [required, date],
  severity: [required, oneOf(['LOW', 'MEDIUM', 'HIGH'])],
  actionTaken: [maxLength(200)]
};

// Equipment validation schema
export const equipmentSchema = {
  name: [required, minLength(2), maxLength(100)],
  category: [required, minLength(2), maxLength(50)],
  serialNumber: [minLength(2), maxLength(50)],
  purchaseDate: [date],
  purchasePrice: [number, positive],
  location: [maxLength(100)],
  condition: [required, oneOf(['EXCELLENT', 'GOOD', 'FAIR', 'POOR'])],
  status: [required, oneOf(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_ORDER', 'RETIRED'])]
};

// Purchase validation schema
export const purchaseSchema = {
  invoiceNumber: [required, minLength(2), maxLength(50)],
  supplier: [required, minLength(2), maxLength(100)],
  purchaseDate: [required, date],
  totalAmount: [required, number, positive],
  category: [required, minLength(2), maxLength(50)],
  description: [maxLength(500)],
  paymentStatus: [required, oneOf(['PENDING', 'PAID', 'OVERDUE'])]
};

// Staff validation schema
export const staffSchema = {
  firstName: [required, minLength(2), maxLength(50)],
  lastName: [required, minLength(2), maxLength(50)],
  email: [required, email],
  phone: [required, phone],
  position: [required, minLength(2), maxLength(100)],
  department: [required, minLength(2), maxLength(100)],
  hireDate: [required, date],
  salary: [number, positive],
  address: [maxLength(200)]
};

// User validation schema
export const userSchema = {
  username: [required, minLength(3), maxLength(50)],
  email: [required, email],
  password: [required, minLength(6), maxLength(100)],
  role: [required, oneOf(Object.values(USER_ROLES))],
  firstName: [required, minLength(2), maxLength(50)],
  lastName: [required, minLength(2), maxLength(50)]
};

// Document validation schema
export const documentSchema = {
  title: [required, minLength(2), maxLength(100)],
  type: [required, minLength(2), maxLength(50)],
  studentId: [integer, positive],
  description: [maxLength(500)]
};

// Custom validation helpers
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Le mot de passe est requis');
    return errors;
  }
  
  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return errors;
};

export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) return 'La confirmation du mot de passe est requise';
  if (password !== confirmation) return 'Les mots de passe ne correspondent pas';
  return null;
};

export const validateFileUpload = (file, maxSize = 5242880, allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']) => {
  const errors = [];
  
  if (!file) {
    errors.push('Aucun fichier sélectionné');
    return errors;
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`La taille du fichier ne doit pas dépasser ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // Check file type
  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(extension)) {
    errors.push(`Type de fichier non autorisé. Types autorisés: ${allowedTypes.join(', ')}`);
  }
  
  return errors;
};

// Academic year validation
export const validateAcademicYear = (year) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 10;
  const maxYear = currentYear + 2;
  
  if (!year) return 'Année académique requise';
  if (year < minYear || year > maxYear) {
    return `Année académique doit être entre ${minYear} et ${maxYear}`;
  }
  return null;
};

// Date range validation
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 'La date de début doit être antérieure à la date de fin';
  }
  
  return null;
};

// Export all validation functions
export default {
  required,
  minLength,
  maxLength,
  email,
  phone,
  number,
  min,
  max,
  integer,
  positive,
  date,
  pastDate,
  futureDate,
  oneOf,
  grade,
  matricule,
  validate,
  validateForm,
  studentSchema,
  teacherSchema,
  classSchema,
  subjectSchema,
  gradeSchema,
  paymentSchema,
  disciplineSchema,
  equipmentSchema,
  purchaseSchema,
  staffSchema,
  userSchema,
  documentSchema,
  validatePassword,
  validatePasswordConfirmation,
  validateFileUpload,
  validateAcademicYear,
  validateDateRange
};