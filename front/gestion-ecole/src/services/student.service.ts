// src/services/student.service.ts
import api from './api.service';

export const studentService = {
  // Récupérer tous les étudiants
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des étudiants');
    }
  },

  // Récupérer un étudiant par ID
  getStudentById: async (id: number) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'étudiant');
    }
  },

  // Créer un étudiant
  createStudent: async (studentData: any) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'étudiant');
    }
  },

  // Mettre à jour un étudiant
  updateStudent: async (id: number, studentData: any) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'étudiant');
    }
  },

  // Supprimer un étudiant
  deleteStudent: async (id: number) => {
    try {
      await api.delete(`/students/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'étudiant');
    }
  },

  // Récupérer les étudiants par classe (optionnel)
  getStudentsByClass: async (classId: number) => {
    try {
      const response = await api.get(`/students/class/${classId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des étudiants de la classe');
    }
  },
};