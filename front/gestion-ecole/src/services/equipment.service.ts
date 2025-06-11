import api from './api.service.js';

export interface Equipment {
  id?: string;
  name: string;
  serialNumber: string;
  category: string;
  location: string;
  status: string;
  assignedTo?: string;
  [key: string]: any;
}

export interface EquipmentFilters {
  serialNumber?: string;
  category?: string;
  location?: string;
  status?: string;
  assignedTo?: string;
  [key: string]: any;
}

const equipmentService = {
  // CRUD de base
  async createEquipment(equipmentData: Equipment): Promise<Equipment> {
    try {
      const response = await api.post('/equipment', equipmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la création du matériel'
      );
    }
  },

  async getAllEquipment(): Promise<Equipment[]> {
    try {
      const response = await api.get('/equipment');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération du matériel'
      );
    }
  },

  async getEquipmentById(id: string): Promise<Equipment> {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération du matériel'
      );
    }
  },

  async updateEquipment(id: string, equipmentData: Partial<Equipment>): Promise<Equipment> {
    try {
      const response = await api.put(`/equipment/${id}`, equipmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la mise à jour du matériel'
      );
    }
  },

  async deleteEquipment(id: string): Promise<{ success: boolean }> {
    try {
      await api.delete(`/equipment/${id}`);
      return { success: true };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la suppression du matériel'
      );
    }
  },

  // Recherche par critères
  async getEquipmentBySerial(serialNumber: string): Promise<Equipment[]> {
    try {
      const response = await api.get(`/equipment/serial/${encodeURIComponent(serialNumber)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la recherche par numéro de série'
      );
    }
  },

  async getEquipmentByCategory(category: string): Promise<Equipment[]> {
    try {
      const response = await api.get(`/equipment/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la recherche par catégorie'
      );
    }
  },

  async getEquipmentByLocation(location: string): Promise<Equipment[]> {
    try {
      const response = await api.get(`/equipment/location/${encodeURIComponent(location)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la recherche par emplacement'
      );
    }
  },

  async getEquipmentByStatus(status: string): Promise<Equipment[]> {
    try {
      const response = await api.get(`/equipment/status/${encodeURIComponent(status)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la recherche par statut'
      );
    }
  },

  async getEquipmentByAssignedTo(assignedTo: string): Promise<Equipment[]> {
    try {
      const response = await api.get(`/equipment/assigned-to/${encodeURIComponent(assignedTo)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la recherche par assignation'
      );
    }
  },

  // Maintenance et garantie
  async getEquipmentMaintenanceDue(): Promise<Equipment[]> {
    try {
      const response = await api.get('/equipment/maintenance-due');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération du matériel à maintenir'
      );
    }
  },

  async getEquipmentUnderWarranty(): Promise<Equipment[]> {
    try {
      const response = await api.get('/equipment/under-warranty');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération du matériel sous garantie'
      );
    }
  },

  // Utilitaires pour filtres multiples
  async searchEquipment(filters: EquipmentFilters = {}): Promise<Equipment[]> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/equipment?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la recherche de matériel'
      );
    }
  }
};

export default equipmentService;