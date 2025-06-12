import api from './api.service';

const BASE_URL = '/staff';

// Types génériques (à adapter selon vos modèles réels)
export interface Staff {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

export interface AttendanceData {
  date: string;
  status: string;
  [key: string]: any;
}

export interface LeaveData {
  startDate: string;
  endDate: string;
  reason: string;
  [key: string]: any;
}

export interface StaffFilters {
  [key: string]: any;
}

export const staffService = {
  create: async (staffData: Partial<Staff>): Promise<Staff> => {
    const response = await api.post(BASE_URL, staffData);
    return response.data;
  },

  getAll: async (): Promise<Staff[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getAllPaginated: async (
    page = 0,
    size = 10,
    sort = 'lastName,asc'
  ): Promise<{ content: Staff[]; totalElements: number; totalPages: number; }> => {
    const response = await api.get(`${BASE_URL}/paginated`, {
      params: { page, size, sort }
    });
    return response.data;
  },

  getById: async (id: number | string): Promise<Staff> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  update: async (id: number | string, staffData: Partial<Staff>): Promise<Staff> => {
    const response = await api.put(`${BASE_URL}/${id}`, staffData);
    return response.data;
  },

  delete: async (id: number | string): Promise<{ message: string }> => {
    await api.delete(`${BASE_URL}/${id}`);
    return { message: 'Membre du personnel supprimé avec succès' };
  },

  getByDepartment: async (department: string): Promise<Staff[]> => {
    const response = await api.get(`${BASE_URL}/department/${department}`);
    return response.data;
  },

  getByPosition: async (position: string): Promise<Staff[]> => {
    const response = await api.get(`${BASE_URL}/position/${position}`);
    return response.data;
  },

  getByRole: async (role: string): Promise<Staff[]> => {
    const response = await api.get(`${BASE_URL}/role/${role}`);
    return response.data;
  },

  getByEmail: async (email: string): Promise<Staff> => {
    const response = await api.get(`${BASE_URL}/email/${email}`);
    return response.data;
  },

  search: async (
    query: string,
    page = 0,
    size = 10
  ): Promise<{ content: Staff[]; totalElements: number; totalPages: number; }> => {
    const response = await api.get(`${BASE_URL}/search`, {
      params: { query, page, size }
    });
    return response.data;
  },

  getStats: async (): Promise<any> => {
    const response = await api.get(`${BASE_URL}/stats`);
    return response.data;
  },

  getActive: async (): Promise<Staff[]> => {
    const response = await api.get(`${BASE_URL}/active`);
    return response.data;
  },

  getInactive: async (): Promise<Staff[]> => {
    const response = await api.get(`${BASE_URL}/inactive`);
    return response.data;
  },

  activate: async (id: number | string): Promise<Staff> => {
    const response = await api.put(`${BASE_URL}/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number | string): Promise<Staff> => {
    const response = await api.put(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  },

  getAttendanceHistory: async (
    id: number | string,
    startDate: string,
    endDate: string
  ): Promise<any[]> => {
    const response = await api.get(`${BASE_URL}/${id}/attendance`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  recordAttendance: async (
    id: number | string,
    attendanceData: AttendanceData
  ): Promise<any> => {
    const response = await api.post(`${BASE_URL}/${id}/attendance`, attendanceData);
    return response.data;
  },

  getLeaves: async (
    id: number | string,
    year?: number
  ): Promise<any[]> => {
    const response = await api.get(`${BASE_URL}/${id}/leaves`, {
      params: year ? { year } : undefined
    });
    return response.data;
  },

  requestLeave: async (
    id: number | string,
    leaveData: LeaveData
  ): Promise<any> => {
    const response = await api.post(`${BASE_URL}/${id}/leaves`, leaveData);
    return response.data;
  },

  approveLeave: async (
    id: number | string,
    leaveId: number | string,
    approved: boolean,
    comments = ''
  ): Promise<any> => {
    const response = await api.put(`${BASE_URL}/${id}/leaves/${leaveId}`, {
      approved,
      comments
    });
    return response.data;
  },

  getOrganizationChart: async (): Promise<any> => {
    const response = await api.get(`${BASE_URL}/organization-chart`);
    return response.data;
  },

  exportToPdf: async (filters: StaffFilters = {}): Promise<Blob> => {
    const response = await api.get(`${BASE_URL}/export/pdf`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  exportToExcel: async (filters: StaffFilters = {}): Promise<Blob> => {
    const response = await api.get(`${BASE_URL}/export/excel`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default staffService;
