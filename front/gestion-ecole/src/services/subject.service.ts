// src/services/subject.service.ts
import api from './api.service';

export const subjectService = {
  // Récupérer toutes les matières
  getAllSubjects: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des matières : ' + error.message);
    }
  },

  // Récupérer une matière par ID
  getSubjectById: async (id: number) => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération de la matière : ' + error.message);
    }
  },

  // Créer une matière
  createSubject: async (subjectData: {
    name: string;
    code: string;
    description: string;
    section: string;
    language: string;
    level: string;
    credits: number;
    coefficient: number;
  }) => {
    try {
      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la création de la matière : ' + error.message);
    }
  },

  // Mettre à jour une matière
  updateSubject: async (id: number, subjectData: {
    name: string;
    code: string;
    description: string;
    section: string;
    language: string;
    level: string;
    credits: number;
    coefficient: number;
  }) => {
    try {
      const response = await api.put(`/subjects/${id}`, subjectData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la mise à jour de la matière : ' + error.message);
    }
  },

  // Supprimer une matière
  deleteSubject: async (id: number) => {
    try {
      await api.delete(`/subjects/${id}`);
    } catch (error: any) {
      throw new Error('Échec de la suppression de la matière : ' + error.message);
    }
  },

  // Assigner un enseignant principal à une matière
  assignTeacher: async (subjectId: number, teacherId: number) => {
    try {
      const response = await api.post(`/subjects/${subjectId}/teacher/${teacherId}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de l\'association de l\'enseignant : ' + error.message);
    }
  },

  // Supprimer l'enseignant principal d'une matière
  removeTeacher: async (subjectId: number) => {
    try {
      const response = await api.delete(`/subjects/subjectId}/teacher`);
      return response.data;
    }catch (error: any) {
      throw new Error('Échec de la dissociation de l\'enseignant : ' + error.message);
    }
  },
};