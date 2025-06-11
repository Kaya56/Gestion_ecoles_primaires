// src/services/discipline.service.ts
import { apiUtils } from './api.service';

export interface Discipline {
  id: number;
  studentId: number;
  incidentDate: string;
  incidentType: 'MINOR' | 'MAJOR' | 'SEVERE';
  description: string;
  actionTaken?: string;
  status: 'PENDING' | 'RESOLVED' | 'ESCALATED';
  reportedBy: string;
  resolvedBy?: string;
  resolvedDate?: string;
  createdDate: string;
  updatedDate?: string;
}

export interface DisciplineCreateRequest {
  studentId: number;
  incidentDate: string;
  incidentType: 'MINOR' | 'MAJOR' | 'SEVERE';
  description: string;
  reportedBy: string;
}

export interface DisciplineUpdateRequest {
  incidentDate?: string;
  incidentType?: 'MINOR' | 'MAJOR' | 'SEVERE';
  description?: string;
  actionTaken?: string;
  status?: 'PENDING' | 'RESOLVED' | 'ESCALATED';
  resolvedBy?: string;
  resolvedDate?: string;
}

export interface DisciplineStats {
  totalIncidents: number;
  pendingIncidents: number;
  resolvedIncidents: number;
  escalatedIncidents: number;
  byType: {
    minor: number;
    major: number;
    severe: number;
  };
  byStatus: {
    pending: number;
    resolved: number;
    escalated: number;
  };
  averageResolutionTime?: number;
}

export interface ActionData {
  actionTaken: string;
  resolvedBy: string;
  resolvedDate?: string;
  status: 'RESOLVED' | 'ESCALATED';
  notes?: string;
}

export interface DisciplineFilters {
  studentId?: number;
  incidentType?: 'MINOR' | 'MAJOR' | 'SEVERE';
  status?: 'PENDING' | 'RESOLVED' | 'ESCALATED';
  reportedBy?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sort?: keyof Discipline;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

const disciplineService = {
  // CRUD de base
  async createDiscipline(disciplineData: DisciplineCreateRequest): Promise<Discipline> {
    try {
      return await apiUtils.post('/disciplines', disciplineData);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la création de la discipline'
      );
    }
  },

  async getAllDisciplines(): Promise<Discipline[]> {
    try {
      return await apiUtils.get('/disciplines');
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines'
      );
    }
  },

  async getDisciplineById(id: number): Promise<Discipline> {
    try {
      return await apiUtils.get(`/disciplines/${id}`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération de la discipline'
      );
    }
  },

  async updateDiscipline(id: number, disciplineData: DisciplineUpdateRequest): Promise<Discipline> {
    try {
      return await apiUtils.put(`/disciplines/${id}`, disciplineData);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la mise à jour de la discipline'
      );
    }
  },

  async deleteDiscipline(id: number): Promise<void> {
    try {
      await apiUtils.delete(`/disciplines/${id}`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la suppression de la discipline'
      );
    }
  },

  // Méthodes pour les étudiants
  async getDisciplinesByStudent(studentId: number): Promise<Discipline[]> {
    try {
      return await apiUtils.get(`/disciplines/student/${studentId}`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines de l\'étudiant'
      );
    }
  },

  async getStudentDisciplineStats(studentId: number): Promise<DisciplineStats> {
    try {
      return await apiUtils.get(`/disciplines/student/${studentId}/stats`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des statistiques de l\'étudiant'
      );
    }
  },

  // Statistiques
  async getDisciplineStats(): Promise<DisciplineStats> {
    try {
      return await apiUtils.get('/disciplines/stats');
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  },

  async getDisciplineStatsByDateRange(startDate: string, endDate: string): Promise<DisciplineStats> {
    try {
      return await apiUtils.get('/disciplines/stats/date-range', { startDate, endDate });
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des statistiques par période'
      );
    }
  },

  // Actions sur les incidents
  async resolveDiscipline(id: number, actionData: ActionData): Promise<Discipline> {
    try {
      return await apiUtils.post(`/disciplines/${id}/resolve`, actionData);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la résolution de la discipline'
      );
    }
  },

  async escalateDiscipline(id: number, actionData: Omit<ActionData, 'status'>): Promise<Discipline> {
    try {
      const escalationData = { ...actionData, status: 'ESCALATED' as const };
      return await apiUtils.post(`/disciplines/${id}/escalate`, escalationData);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de l\'escalade de la discipline'
      );
    }
  },

  // Listes filtrées
  async getPendingDisciplines(): Promise<Discipline[]> {
    try {
      return await apiUtils.get('/disciplines/pending');
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines en attente'
      );
    }
  },

  async getResolvedDisciplines(): Promise<Discipline[]> {
    try {
      return await apiUtils.get('/disciplines/resolved');
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines résolues'
      );
    }
  },

  async getEscalatedDisciplines(): Promise<Discipline[]> {
    try {
      return await apiUtils.get('/disciplines/escalated');
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines escaladées'
      );
    }
  },

  async getRecentDisciplines(days = 7): Promise<Discipline[]> {
    try {
      return await apiUtils.get(`/disciplines/recent?days=${days}`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines récentes'
      );
    }
  },

  async getDisciplinesByType(incidentType: 'MINOR' | 'MAJOR' | 'SEVERE'): Promise<Discipline[]> {
    try {
      return await apiUtils.get(`/disciplines/type/${incidentType}`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines par type'
      );
    }
  },

  // Pagination et filtrage
  async getDisciplinesPaginated(
    page = 0,
    size = 10,
    sort: keyof Discipline = 'createdDate'
  ): Promise<PaginatedResponse<Discipline>> {
    try {
      return await apiUtils.get('/disciplines/paginated', { page, size, sort });
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération paginée des disciplines'
      );
    }
  },

  async getDisciplinesByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sort: keyof Discipline = 'createdDate'
  ): Promise<PaginatedResponse<Discipline>> {
    try {
      const params = {
        startDate,
        endDate,
        page,
        size,
        sort
      };

      return await apiUtils.get('/disciplines/date-range-paginated', params);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines par période'
      );
    }
  },

  async filterDisciplines(filters: DisciplineFilters): Promise<PaginatedResponse<Discipline>> {
    const {
      studentId,
      incidentType,
      status,
      reportedBy,
      startDate,
      endDate,
      page = 0,
      size = 10,
      sort = 'createdDate'
    } = filters;

    try {
      let disciplines = await disciplineService.getAllDisciplines();

      // Appliquer les filtres
      if (studentId) disciplines = disciplines.filter(d => d.studentId === studentId);
      if (incidentType) disciplines = disciplines.filter(d => d.incidentType === incidentType);
      if (status) disciplines = disciplines.filter(d => d.status === status);
      if (reportedBy) disciplines = disciplines.filter(d => d.reportedBy.toLowerCase().includes(reportedBy.toLowerCase()));
      
      if (startDate) {
        disciplines = disciplines.filter(d => new Date(d.incidentDate) >= new Date(startDate));
      }
      if (endDate) {
        disciplines = disciplines.filter(d => new Date(d.incidentDate) <= new Date(endDate));
      }

      // Tri
      disciplines.sort((a, b) => {
        const aValue = a[sort];
        const bValue = b[sort];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return bValue.localeCompare(aValue); // Tri décroissant par défaut
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return bValue - aValue;
        } else {
          return String(bValue || '').localeCompare(String(aValue || ''));
        }
      });

      // Pagination
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedDisciplines = disciplines.slice(startIndex, endIndex);

      return {
        content: paginatedDisciplines,
        totalElements: disciplines.length,
        totalPages: Math.ceil(disciplines.length / size),
        size,
        number: page,
        numberOfElements: paginatedDisciplines.length,
        first: page === 0,
        last: page >= Math.ceil(disciplines.length / size) - 1,
      };
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors du filtrage des disciplines'
      );
    }
  },

  // Fonctions utilitaires
  async getDisciplinesByReporter(reportedBy: string): Promise<Discipline[]> {
    try {
      return await apiUtils.get(`/disciplines/reporter/${encodeURIComponent(reportedBy)}`);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Erreur lors de la récupération des disciplines par rapporteur'
      );
    }
  },

  async searchDisciplines(searchTerm: string): Promise<Discipline[]> {
    try {
      return await apiUtils.get('/disciplines/search', { q: searchTerm });
    } catch (error: any) {
      // Fallback: recherche locale
      const disciplines = await disciplineService.getAllDisciplines();
      const term = searchTerm.toLowerCase();
      
      return disciplines.filter(d =>
        d.description.toLowerCase().includes(term) ||
        d.reportedBy.toLowerCase().includes(term) ||
        (d.actionTaken && d.actionTaken.toLowerCase().includes(term)) ||
        (d.resolvedBy && d.resolvedBy.toLowerCase().includes(term))
      );
    }
  }
};

export default disciplineService;