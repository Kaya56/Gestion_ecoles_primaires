// src/services/student.service.ts
import { apiUtils } from './api.service';
import type { Student, StudentCreateRequest, StudentUpdateRequest } from '../types/student.types';

export interface StudentFilters {
  section?: 'PRIMARY' | 'SECONDARY';
  classId?: number;
  language?: 'FRENCH' | 'ENGLISH';
  academicYear?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
  sort?: keyof Student;
}

const studentService = {
  // CRUD Étudiants

  createStudent: async (studentData: StudentCreateRequest): Promise<Student> => {
    return await apiUtils.post('/students', studentData);
  },

  getStudents: async (): Promise<Student[]> => {
    return await apiUtils.get('/students');
  },

  getStudentsPaginated: async (
    page = 0,
    size = 10,
    sort: keyof Student = 'id'
  ) => {
    return await apiUtils.get('/students/paginated', { page, size, sort });
  },

  getStudentById: async (studentId: number): Promise<Student> => {
    return await apiUtils.get(`/students/${studentId}`);
  },

  updateStudent: async (studentId: number, studentData: StudentUpdateRequest): Promise<Student> => {
    return await apiUtils.put(`/students/${studentId}`, studentData);
  },

  deleteStudent: async (studentId: number): Promise<void> => {
    return await apiUtils.delete(`/students/${studentId}`);
  },

  // Filtres et recherche

  getStudentsByClass: async (classId: number): Promise<Student[]> => {
    return await apiUtils.get(`/students/class/${classId}`);
  },

  getStudentsBySection: async (section: 'PRIMARY' | 'SECONDARY'): Promise<Student[]> => {
    return await apiUtils.get(`/students/section/${section}`);
  },

  getStudentsByLanguage: async (language: 'FRENCH' | 'ENGLISH'): Promise<Student[]> => {
    return await apiUtils.get(`/students/language/${language}`);
  },

  searchStudents: async (searchTerm: string): Promise<Student[]> => {
    return await apiUtils.get('/students/search', { q: searchTerm });
  },

  // Fonctions étendues

  getStudentPayments: async (studentId: number) => {
    try {
      return await apiUtils.get(`/students/${studentId}/payments`);
    } catch {
      const paymentService = (await import('./payment.service')).default;
      return await paymentService.getByStudent(studentId.toString());
    }
  },

  getStudentGrades: async (studentId: number) => {
    try {
      return await apiUtils.get(`/students/${studentId}/grades`);
    } catch {
      const gradeService = (await import('./grade.service')).default;
      return await gradeService.getGradesByStudent(studentId);
    }
  },

  getStudentDisciplines: async (studentId: number) => {
    try {
      return await apiUtils.get(`/students/${studentId}/disciplines`);
    } catch {
      const disciplineService = (await import('./discipline.service')).default;
      // Correction : utiliser une méthode appropriée pour récupérer les disciplines d'un étudiant
      return await disciplineService.getDisciplinesByStudent(studentId);
    }
  },

  // Fonctions utilitaires

  getStudentStats: async () => {
    const students = await studentService.getStudents();
    const stats = {
      total: students.length,
      bySection: {} as Record<string, number>,
      byLanguage: {} as Record<string, number>,
      byClass: {} as Record<number, number>, // Correction: classId est un number
    };

    students.forEach((student) => {
      stats.bySection[student.section] = (stats.bySection[student.section] || 0) + 1;
      
      if (student.language) {
        stats.byLanguage[student.language] = (stats.byLanguage[student.language] || 0) + 1;
      }
      
      if (student.classId) {
        stats.byClass[student.classId] = (stats.byClass[student.classId] || 0) + 1;
      }
    });

    return stats;
  },

  // Correction : la propriété matricule n'existe pas dans l'interface Student
  // Utilisation de l'id ou d'une autre propriété unique
  checkStudentExists: async (studentId: number, excludeStudentId: number | null = null): Promise<boolean> => {
    try {
      const students = await studentService.getStudents();
      if (excludeStudentId) {
        return students.some((student) => student.id === studentId && student.id !== excludeStudentId);
      }
      return students.some((student) => student.id === studentId);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'étudiant:', error);
      return false;
    }
  },

  // Correction : génération d'un identifiant unique basé sur les données disponibles
  generateStudentId: async (section: 'PRIMARY' | 'SECONDARY', year?: number): Promise<string> => {
    try {
      const currentYear = year || new Date().getFullYear();
      const prefix = `${section}${currentYear}`;
      const students = await studentService.getStudentsBySection(section);
      
      // Génération d'un ID basé sur le nombre d'étudiants existants
      const nextNumber = students.length + 1;
      return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Erreur lors de la génération de l\'ID étudiant:', error);
      throw error;
    }
  },

  filterStudents: async (filters: StudentFilters) => {
    const {
      section,
      classId,
      language,
      academicYear,
      searchTerm,
      page = 0,
      size = 10,
      sort = 'lastName',
    } = filters;

    let students = await studentService.getStudents();

    if (section) students = students.filter((s) => s.section === section);
    if (classId) students = students.filter((s) => s.classId === classId);
    if (language) students = students.filter((s) => s.language === language);
    // Correction : academicYear n'existe pas dans l'interface Student
    // if (academicYear) students = students.filter((s) => s.academicYear === academicYear);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(term) ||
          s.lastName.toLowerCase().includes(term) ||
          s.parentName.toLowerCase().includes(term) ||
          s.parentPhone.includes(term)
      );
    }

    // Correction du tri avec vérification de type
    students.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      
      // Gestion des différents types de données
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      } else {
        return String(aValue || '').localeCompare(String(bValue || ''));
      }
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedStudents = students.slice(startIndex, endIndex);

    return {
      content: paginatedStudents,
      totalElements: students.length,
      totalPages: Math.ceil(students.length / size),
      size,
      number: page,
      numberOfElements: paginatedStudents.length,
      first: page === 0,
      last: page >= Math.ceil(students.length / size) - 1,
    };
  },
};

export default studentService;