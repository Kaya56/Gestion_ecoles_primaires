import api from './api.service';

interface GradeData {
  // Ajoutez ici les propriétés attendues pour une note
  [key: string]: any;
}

interface Filters {
  [key: string]: string | number | null | undefined;
}

const gradeService = {
  // CRUD de base
  async createGrade(gradeData: GradeData): Promise<any> {
    try {
      const response = await api.post('/grades', gradeData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la création de la note'
      );
    }
  },

  async getGradesByClass(classId: string | number): Promise<any[]> {
    try {
      const response = await api.get(`/grades/class/${classId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Erreur lors de la récupération des notes de la classe"
      );
    }
  },

  async getGradeById(id: string | number): Promise<any> {
    try {
      const response = await api.get(`/grades/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération de la note'
      );
    }
  },

  async updateGrade(id: string | number, gradeData: GradeData): Promise<any> {
    try {
      const response = await api.put(`/grades/${id}`, gradeData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la mise à jour de la note'
      );
    }
  },

  async deleteGrade(id: string | number): Promise<{ success: boolean }> {
    try {
      await api.delete(`/grades/${id}`);
      return { success: true };
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la suppression de la note'
      );
    }
  },

  // Listes de notes
  async getGradesByStudent(studentId: string | number): Promise<any> {
    try {
      const response = await api.get(`/grades/student/${studentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Erreur lors de la récupération des notes de l'élève"
      );
    }
  },

  async getGradesBySubject(subjectId: string | number): Promise<any> {
    try {
      const response = await api.get(`/grades/subject/${subjectId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Erreur lors de la récupération des notes de la matière"
      );
    }
  },

  async getGradesByStudentAndSubject(studentId: string | number, subjectId: string | number): Promise<any> {
    try {
      const response = await api.get(`/grades/student/${studentId}/subject/${subjectId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des notes'
      );
    }
  },

  // Moyennes
  async getStudentAverage(studentId: string | number, semester?: string | number | null): Promise<any> {
    try {
      const params = semester ? `?semester=${semester}` : '';
      const response = await api.get(`/grades/student/${studentId}/average${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Erreur lors du calcul de la moyenne de l'élève"
      );
    }
  },

  async getSubjectAverage(subjectId: string | number, semester?: string | number | null): Promise<any> {
    try {
      const params = semester ? `?semester=${semester}` : '';
      const response = await api.get(`/grades/subject/${subjectId}/average${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Erreur lors du calcul de la moyenne de la matière"
      );
    }
  },

  // Création de notes en lot
  async createBulkGrades(gradesData: GradeData[]): Promise<any> {
    try {
      const response = await api.post('/grades/bulk', gradesData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la création des notes en lot'
      );
    }
  },

  // Récupération de notes avec filtres
  async getGradesWithFilters(filters: Filters = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
      const response = await api.get(`/grades?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des notes'
      );
    }
  },

  // Statistiques de classe
  async getClassGradeStatistics(classId: string | number, subjectId?: string | number | null, period?: string | number | null): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (subjectId) params.append('subjectId', String(subjectId));
      if (period) params.append('period', String(period));
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/grades/class/${classId}/statistics${query}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des statistiques de classe'
      );
    }
  },

  // Bulletin de notes
  async getStudentBulletin(studentId: string | number, period: string | number, academicYear?: string | number | null): Promise<any> {
    try {
      const params = new URLSearchParams({ period: String(period) });
      if (academicYear) params.append('academicYear', String(academicYear));
      const response = await api.get(`/grades/student/${studentId}/bulletin?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la génération du bulletin'
      );
    }
  }
};

export default gradeService;