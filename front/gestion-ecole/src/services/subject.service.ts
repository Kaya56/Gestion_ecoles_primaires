// src/services/subject.service.ts
import { apiUtils } from './api.service';

// Types
export interface Subject {
  id: string;
  name: string;
  section: string;
  teacherId?: string | null;
  coefficient?: number;
  weeklyHours?: number;
  description?: string;
  code?: string;
  [key: string]: any;
}

export interface SubjectStats {
  total: number;
  bySection: Record<string, number>;
  withTeacher: number;
  withoutTeacher: number;
  totalCoefficient: number;
  totalWeeklyHours: number;
}

export interface FilterOptions {
  section?: string;
  teacherId?: string;
  hasTeacher?: boolean;
  searchTerm?: string;
  sortBy?: keyof Subject;
  sortOrder?: 'asc' | 'desc';
}

const subjectService = {
  // CRUD Matières

  createSubject: async (subjectData: Partial<Subject>): Promise<Subject> => {
    return await apiUtils.post('/subjects', subjectData);
  },

  getSubjects: async (): Promise<Subject[]> => {
    return await apiUtils.get('/subjects');
  },

  getSubjectById: async (subjectId: string): Promise<Subject> => {
    return await apiUtils.get(`/subjects/${subjectId}`);
  },

  updateSubject: async (subjectId: string, subjectData: Partial<Subject>): Promise<Subject> => {
    return await apiUtils.put(`/subjects/${subjectId}`, subjectData);
  },

  deleteSubject: async (subjectId: string): Promise<void> => {
    return await apiUtils.delete(`/subjects/${subjectId}`);
  },

  // Filtres et recherche

  getSubjectsByTeacher: async (teacherId: string): Promise<Subject[]> => {
    return await apiUtils.get(`/subjects/teacher/${teacherId}`);
  },

  getSubjectsBySection: async (section: string): Promise<Subject[]> => {
    return await apiUtils.get(`/subjects/section/${section}`);
  },

  searchSubjects: async (searchTerm: string): Promise<Subject[]> => {
    return await apiUtils.get('/subjects/search', { q: searchTerm });
  },

  // Gestion des enseignants

  assignTeacher: async (subjectId: string, teacherId: string): Promise<Subject> => {
    return await apiUtils.post(`/subjects/${subjectId}/teacher/${teacherId}`);
  },

  removeTeacher: async (subjectId: string): Promise<void> => {
    return await apiUtils.delete(`/subjects/${subjectId}/teacher`);
  },

  // Fonctions utilitaires

  getSubjectStats: async (): Promise<SubjectStats> => {
    const subjects = await subjectService.getSubjects();
    const stats: SubjectStats = {
      total: subjects.length,
      bySection: {},
      withTeacher: subjects.filter(s => !!s.teacherId).length,
      withoutTeacher: subjects.filter(s => !s.teacherId).length,
      totalCoefficient: subjects.reduce((sum, s) => sum + (s.coefficient || 0), 0),
      totalWeeklyHours: subjects.reduce((sum, s) => sum + (s.weeklyHours || 0), 0)
    };

    subjects.forEach(subject => {
      if (subject.section) {
        stats.bySection[subject.section] = (stats.bySection[subject.section] || 0) + 1;
      }
    });

    return stats;
  },

  checkSubjectNameExists: async (
    name: string,
    section: string,
    excludeSubjectId: string | null = null
  ): Promise<boolean> => {
    try {
      const subjects = await subjectService.getSubjects();
      if (excludeSubjectId) {
        return subjects.some(subject =>
          subject.name === name &&
          subject.section === section &&
          subject.id !== excludeSubjectId
        );
      }
      return subjects.some(subject => subject.name === name && subject.section === section);
    } catch (error) {
      console.error('Erreur lors de la vérification du nom de matière:', error);
      return false;
    }
  },

  filterSubjects: async (filters: FilterOptions): Promise<Subject[]> => {
    const {
      section,
      teacherId,
      hasTeacher,
      searchTerm,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters;

    let subjects = await subjectService.getSubjects();

    if (section) {
      subjects = subjects.filter(s => s.section === section);
    }

    if (teacherId) {
      subjects = subjects.filter(s => s.teacherId === teacherId);
    }

    if (hasTeacher !== undefined) {
      subjects = subjects.filter(s => hasTeacher ? !!s.teacherId : !s.teacherId);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      subjects = subjects.filter(s =>
        s.name.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term)) ||
        (s.code && s.code.toLowerCase().includes(term))
      );
    }

    subjects.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'coefficient' || sortBy === 'weeklyHours') {
        aValue = aValue || 0;
        bValue = bValue || 0;
        const comparison = (aValue as number) - (bValue as number);
        return sortOrder === 'desc' ? -comparison : comparison;
      }

      aValue = (aValue || '').toString();
      bValue = (bValue || '').toString();
      const comparison = (aValue as string).localeCompare(bValue as string);
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return subjects;
  },

  getAvailableSubjectsForSection: async (section: string): Promise<Subject[]> => {
    return await subjectService.getSubjectsBySection(section);
  },

  getSubjectsWithoutTeacher: async (): Promise<Subject[]> => {
    const subjects = await subjectService.getSubjects();
    return subjects.filter(subject => !subject.teacherId);
  },

  getTeacherSubjectStats: async (teacherId: string): Promise<any> => {
    const subjects = await subjectService.getSubjectsByTeacher(teacherId);
    const gradeService = await import('./grade.service');

    const stats = {
      totalSubjects: subjects.length,
      totalWeeklyHours: subjects.reduce((sum, s) => sum + (s.weeklyHours || 0), 0),
      totalCoefficient: subjects.reduce((sum, s) => sum + (s.coefficient || 0), 0),
      subjectDetails: [] as any[]
    };

    for (const subject of subjects) {
      try {
        const grades = await gradeService.default.getGradesBySubject(subject.id);
        const subjectStats = {
          ...subject,
          totalGrades: grades.length,
          averageGrade: grades.length > 0
            ? grades.reduce((sum: number, g: any) => sum + g.value, 0) / grades.length
            : 0
        };
        stats.subjectDetails.push(subjectStats);
      } catch {
        stats.subjectDetails.push({
          ...subject,
          totalGrades: 0,
          averageGrade: 0
        });
      }
    }

    return stats;
  },

  duplicateSubjectForSection: async (subjectId: string, targetSection: string): Promise<Subject> => {
    const originalSubject = await subjectService.getSubjectById(subjectId);
    const duplicatedSubject: Partial<Subject> = {
      ...originalSubject,
      section: targetSection,
      teacherId: null
    };
    delete (duplicatedSubject as any).id;
    return await subjectService.createSubject(duplicatedSubject);
  },
};

export default subjectService;
