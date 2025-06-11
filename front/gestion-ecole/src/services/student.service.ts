import api from './api.service';

export const studentService = {
  // Récupérer tous les étudiants
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des étudiants : ' + error.message);
    }
  },

  // Récupérer les étudiants par classe
  getStudentsByClass: async (classId: number) => {
    try {
      const response = await api.get(`/students/class/${classId}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération des étudiants par classe : ' + error.message);
    }
  },

  // Récupérer un étudiant par ID
  getStudentById: async (id: number) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la récupération de l\'étudiant : ' + error.message);
    }
  },

  // Créer un étudiant
  createStudent: async (studentData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    section: string;
    language: string;
    academicYear: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    address: string;
    classId: number;
  }) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error: any) {
      throw new Error('Échec de la création de l\'étudiant : ' + error.message);
    }
  },
};