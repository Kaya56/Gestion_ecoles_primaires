import axios from 'axios';
import type { Discipline, DisciplineCreateRequest } from '../types/discipline.types';

const API_URL = '/api/disciplines';

export const getDisciplines = async (params: { page?: number; size?: number; search?: string }) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getDisciplineById = async (id: number): Promise<Discipline> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createDiscipline = async (data: DisciplineCreateRequest) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateDiscipline = async (id: number, data: DisciplineCreateRequest) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteDiscipline = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const getDisciplinesByStudent = async (studentId: number) => {
  const response = await axios.get(`${API_URL}/student/${studentId}`);
  return response.data;
};

export const getDisciplinesByDateRange = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_URL}/date-range`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getRecentDisciplines = async (days: number) => {
  const response = await axios.get(`${API_URL}/recent`, { params: { days } });
  return response.data;
};