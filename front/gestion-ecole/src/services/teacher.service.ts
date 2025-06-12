// src/services/teacher.service.ts
import api from './api.service';

export const teacherService = {
  // Récupérer tous les enseignants
  getAllTeachers: async () => {
    try {
      const response = await api.get('/teachers');
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des enseignants : ' + error.message);
    }
  },

  // Récupérer un enseignant par ID
  getTeacherById: async (id: number) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération de l\'enseignant : ' + error.message);
    }
  },

  // Créer un enseignant
  createTeacher: async (teacherData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    hireDate: string;
    specialization: string;
    taskDescription: string;
  }) => {
    try {
      const response = await api.post('/teachers', teacherData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la création de l\'enseignant : ' + error.message);
    }
  },

  // Mettre à jour un enseignant
  updateTeacher: async (id: number, teacherData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    hireDate: string;
    specialization: string;
    taskDescription: string;
  }) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la mise à jour de l\'enseignant : ' + error.message);
    }
  },

  // Supprimer un enseignant
  deleteTeacher: async (id: number) => {
    try {
      await api.delete(`/teachers/${id}`);
    } catch (error: any) {
      throw new Error('Échec de la suppression de l\'enseignant : ' + error.message);
    }
  },
};