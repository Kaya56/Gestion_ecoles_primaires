// src/services/teacher.service.ts
import { apiUtils } from './api.service';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization?: string;
  active?: boolean;
  mainClassId?: string;
  [key: string]: any;
}

export interface TeacherFilters {
  specialization?: string;
  active?: boolean;
  searchTerm?: string;
  sortBy?: keyof Teacher;
  sortOrder?: 'asc' | 'desc';
}

const teacherService = {
  // CRUD Enseignants

  createTeacher: async (teacherData: Partial<Teacher>) => {
    return await apiUtils.post('/teachers', teacherData);
  },

  getTeachers: async (): Promise<Teacher[]> => {
    return await apiUtils.get('/teachers');
  },

  getTeacherById: async (teacherId: string): Promise<Teacher> => {
    return await apiUtils.get(`/teachers/${teacherId}`);
  },

  updateTeacher: async (teacherId: string, teacherData: Partial<Teacher>) => {
    return await apiUtils.put(`/teachers/${teacherId}`, teacherData);
  },

  deleteTeacher: async (teacherId: string) => {
    return await apiUtils.delete(`/teachers/${teacherId}`);
  },

  // Filtres et recherche

  getTeacherByEmail: async (email: string): Promise<Teacher> => {
    return await apiUtils.get(`/teachers/email/${email}`);
  },

  getTeachersBySpecialization: async (specialization: string): Promise<Teacher[]> => {
    return await apiUtils.get(`/teachers/specialization/${specialization}`);
  },

  searchTeachers: async (searchTerm: string): Promise<Teacher[]> => {
    return await apiUtils.get('/teachers/search', { q: searchTerm });
  },

  // Fonctions étendues

  getTeacherClasses: async (teacherId: string) => {
    try {
      return await apiUtils.get(`/teachers/${teacherId}/classes`);
    } catch {
      const classService = (await import('./class.service')).default;
      return await classService.getClassesByTeacher(teacherId);
    }
  },

  getTeacherSubjects: async (teacherId: string) => {
    try {
      return await apiUtils.get(`/teachers/${teacherId}/subjects`);
    } catch {
      const subjectService = (await import('./subject.service')).default;
      return await subjectService.getSubjectsByTeacher(teacherId);
    }
  },

  // Fonctions utilitaires

  getTeacherStats: async () => {
    const teachers = await teacherService.getTeachers();
    const stats = {
      total: teachers.length,
      bySpecialization: {} as Record<string, number>,
      active: teachers.filter(t => t.active !== false).length,
      inactive: teachers.filter(t => t.active === false).length
    };

    teachers.forEach(teacher => {
      if (teacher.specialization) {
        stats.bySpecialization[teacher.specialization] =
          (stats.bySpecialization[teacher.specialization] || 0) + 1;
      }
    });

    return stats;
  },

  checkEmailExists: async (email: string, excludeTeacherId: string | null = null): Promise<boolean> => {
    try {
      const teachers = await teacherService.getTeachers();
      if (excludeTeacherId) {
        return teachers.some(teacher => teacher.email === email && teacher.id !== excludeTeacherId);
      }
      return teachers.some(teacher => teacher.email === email);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  },

  filterTeachers: async (filters: TeacherFilters): Promise<Teacher[]> => {
    const {
      specialization,
      active,
      searchTerm,
      sortBy = 'lastName',
      sortOrder = 'asc'
    } = filters;

    let teachers = await teacherService.getTeachers();

    if (specialization) {
      teachers = teachers.filter(t => t.specialization === specialization);
    }

    if (active !== undefined) {
      teachers = teachers.filter(t => t.active === active);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      teachers = teachers.filter(t =>
        t.firstName.toLowerCase().includes(term) ||
        t.lastName.toLowerCase().includes(term) ||
        (t.email && t.email.toLowerCase().includes(term)) ||
        (t.phone && t.phone.includes(term)) ||
        (t.specialization && t.specialization.toLowerCase().includes(term))
      );
    }

    teachers.sort((a, b) => {
      const aValue = (a[sortBy] || '').toString();
      const bValue = (b[sortBy] || '').toString();
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return teachers;
  },

  getAvailableTeachers: async (): Promise<Teacher[]> => {
    const teachers = await teacherService.getTeachers();
    return teachers.filter(teacher => !teacher.mainClassId);
  },

  getSpecializations: async (): Promise<string[]> => {
    const teachers = await teacherService.getTeachers();
    const specializations = [...new Set(
      teachers
        .map(t => t.specialization)
        .filter(s => s && s.trim() !== '')
    )] as string[];
    return specializations.sort();
  }
};

export default teacherService;
