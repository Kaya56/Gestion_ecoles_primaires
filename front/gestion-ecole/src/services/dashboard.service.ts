// src/services/dashboard.service.ts
import api from './api.service';

export const dashboardService = {
  // Récupérer les statistiques globales
  getStatistics: async () => {
    try {
      const [classes, students, teachers, subjects] = await Promise.all([
        api.get('/classes').then((res) => res.data),
        api.get('/students').then((res) => res.data),
        api.get('/teachers').then((res) => res.data),
        api.get('/subjects').then((res) => res.data),
      ]);
      return {
        totalClasses: classes.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalSubjects: subjects.length,
        classesBySection: {
          creche: classes.filter((c: any) => c.section === 'CRECHE').length,
          maternelle: classes.filter((c: any) => c.section === 'MATERNELLE').length,
          primaire: classes.filter((c: any) => c.section === 'PRIMAIRE').length,
        },
      };
    } catch (error: any) {
      throw new Error('Échec de la récupération des statistiques : ' + error.message);
    }
  },
};