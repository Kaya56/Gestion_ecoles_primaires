// src/services/class.service.ts
import { apiUtils } from './api.service';

export interface Classe {
  id: string;
  name: string;
  section: string;
  level: string;
  teacherId?: string;
  academicYear?: string;
  description?: string;
  [key: string]: any;
}

export interface ClassFilters {
  section?: string;
  level?: string;
  teacherId?: string;
  academicYear?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const classService = {
  // CRUD Classes

  createClass: async (classData: Partial<Classe>) => {
    return await apiUtils.post('/classes', classData);
  },

  getClasses: async (): Promise<Classe[]> => {
    return await apiUtils.get('/classes');
  },

  getClassById: async (classId: string): Promise<Classe> => {
    return await apiUtils.get(`/classes/${classId}`);
  },

  updateClass: async (classId: string, classData: Partial<Classe>) => {
    return await apiUtils.put(`/classes/${classId}`, classData);
  },

  deleteClass: async (classId: string) => {
    return await apiUtils.delete(`/classes/${classId}`);
  },

  // Fonctions spécialisées

  getClassesByTeacher: async (teacherId: string): Promise<Classe[]> => {
    const classes = await classService.getClasses();
    return classes.filter(cls => cls.teacherId === teacherId);
  },

  getClassesBySection: async (section: string): Promise<Classe[]> => {
    const classes = await classService.getClasses();
    return classes.filter(cls => cls.section === section);
  },

  getClassesByLevel: async (level: string): Promise<Classe[]> => {
    const classes = await classService.getClasses();
    return classes.filter(cls => cls.level === level);
  },

  getClassStatistics: async (classId: string) => {
    const studentService = (await import('./student.service')).default;
    const gradeService = (await import('./grade.service')).default;

    const [students, grades] = await Promise.all([
      studentService.getStudentsByClass(Number(classId)),
      gradeService.getGradesByClass ? gradeService.getGradesByClass(classId) : Promise.resolve([])
    ]);

    const stats: any = {
      totalStudents: students.length,
      averageGrade: 0,
      passRate: 0,
      attendanceRate: 0,
      subjectStats: {}
    };

    if (grades.length > 0) {
      const totalGrades = grades.reduce((sum: number, grade: any) => sum + grade.value, 0);
      stats.averageGrade = totalGrades / grades.length;
      stats.passRate = (grades.filter((grade: any) => grade.value >= 10).length / grades.length) * 100;

      const gradesBySubject: { [subjectId: string]: number[] } = {};
      grades.forEach((grade: any) => {
        if (!gradesBySubject[grade.subjectId]) gradesBySubject[grade.subjectId] = [];
        gradesBySubject[grade.subjectId].push(grade.value);
      });

      Object.keys(gradesBySubject).forEach(subjectId => {
        const subjectGrades = gradesBySubject[subjectId];
        const average = subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length;
        stats.subjectStats[subjectId] = {
          average,
          count: subjectGrades.length,
          passRate: (subjectGrades.filter(grade => grade >= 10).length / subjectGrades.length) * 100
        };
      });
    }

    return stats;
  },

  getClassesStats: async () => {
    const classes = await classService.getClasses();
    const studentService = (await import('./student.service')).default;

    const stats: any = {
      totalClasses: classes.length,
      bySection: {},
      byLevel: {},
      totalStudents: 0,
      averageStudentsPerClass: 0
    };

    const classesWithStudents = await Promise.all(
      classes.map(async (cls) => {
        const students = await studentService.getStudentsByClass(Number(cls.id));
        return { ...cls, studentCount: students.length };
      })
    );

    classesWithStudents.forEach(cls => {
      stats.bySection[cls.section] = (stats.bySection[cls.section] || 0) + 1;
      if (cls.level) stats.byLevel[cls.level] = (stats.byLevel[cls.level] || 0) + 1;
      stats.totalStudents += cls.studentCount;
    });

    stats.averageStudentsPerClass = stats.totalClasses > 0 ? stats.totalStudents / stats.totalClasses : 0;
    return stats;
  },

  checkClassNameExists: async (name: string, excludeClassId: string | null = null): Promise<boolean> => {
    try {
      const classes = await classService.getClasses();
      if (excludeClassId) {
        return classes.some(cls => cls.name === name && cls.id !== excludeClassId);
      }
      return classes.some(cls => cls.name === name);
    } catch (error) {
      console.error('Erreur lors de la vérification du nom de classe:', error);
      return false;
    }
  },

  filterClasses: async (filters: ClassFilters): Promise<Classe[]> => {
    const {
      section,
      level,
      teacherId,
      academicYear,
      searchTerm,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters;

    let classes = await classService.getClasses();

    if (section) classes = classes.filter(cls => cls.section === section);
    if (level) classes = classes.filter(cls => cls.level === level);
    if (teacherId) classes = classes.filter(cls => cls.teacherId === teacherId);
    if (academicYear) classes = classes.filter(cls => cls.academicYear === academicYear);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      classes = classes.filter(cls =>
        cls.name.toLowerCase().includes(term) ||
        (cls.description && cls.description.toLowerCase().includes(term))
      );
    }

    classes.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return classes;
  },

  getLevels: async (): Promise<string[]> => {
    const classes = await classService.getClasses();
    const levels = [...new Set(
      classes.map(cls => cls.level).filter(level => level && level.trim() !== '')
    )];
    return levels.sort();
  },

  getSections: async (): Promise<string[]> => {
    const classes = await classService.getClasses();
    const sections = [...new Set(
      classes.map(cls => cls.section).filter(section => section && section.trim() !== '')
    )];
    return sections.sort();
  },

  assignTeacher: async (classId: string, teacherId: string) => {
    return await classService.updateClass(classId, { teacherId });
  },

  removeTeacher: async (classId: string) => {
    return await classService.updateClass(classId, { teacherId: undefined });
  },
};

export default classService;
