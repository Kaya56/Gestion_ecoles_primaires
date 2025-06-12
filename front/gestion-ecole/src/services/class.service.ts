// src/services/class.service.ts
import api from './api.service';

export const classService = {
  // Récupérer toutes les classes
  getAllClasses: async () => {
    try {
      const response = await api.get('/classes');
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des classes : ' + error.message);
    }
  },

  // Récupérer une classe par ID
  getClassById: async (id: number) => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération de la classe : ' + error.message);
    }
  },

  // Récupérer les étudiants d'une classe
  getClassStudents: async (id: number) => {
    try {
      const response = await api.get(`/classes/${id}/students`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des étudiants : ' + error.message);
    }
  },

  // Récupérer les statistiques d'une classe
  getClassStatistics: async (id: number) => {
    try {
      const response = await api.get(`/classes/${id}/statistics`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des statistiques : ' + error.message);
    }
  },

  // Créer une classe
  createClass: async (classData: {
    name: string;
    level: string;
    section: string;
    language: string;
    academicYear: string;
    maxCapacity: number;
  }) => {
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la création de la classe : ' + error.message);
    }
  },

  // Mettre à jour une classe
  updateClass: async (id: number, classData: {
    name: string;
    level: string;
    section: string;
    language: string;
    academicYear: string;
    maxCapacity: number;
  }) => {
    try {
      const response = await api.put(`/classes/${id}`, classData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la mise à jour de la classe : ' + error.message);
    }
  },

  // Supprimer une classe
  deleteClass: async (id: number) => {
    try {
      await api.delete(`/classes/${id}`);
    } catch (error: any) {
      throw new Error('Échec de la suppression de la classe : ' + error.message);
    }
  },

  // Assigner un enseignant à une classe
  assignTeacher: async (classId: number, teacherId: number) => {
    try {
      const response = await api.put(`/classes/${classId}/assign-teacher/${teacherId}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de l\'association de l\'enseignant : ' + error.message);
    }
  },
};