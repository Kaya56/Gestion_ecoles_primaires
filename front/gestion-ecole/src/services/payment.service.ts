import api from './api.service';

const BASE_URL = '/payments';

// Types pour les paramètres et retours
export interface PaymentData {
  // Ajoutez ici les propriétés attendues pour un paiement
  [key: string]: any;
}

export interface Payment {
  // Ajoutez ici les propriétés d'un paiement retourné par l'API
  [key: string]: any;
}

export const paymentService = {
  // Créer un nouveau paiement
  create: async (paymentData: PaymentData): Promise<Payment> => {
    try {
      const response = await api.post(BASE_URL, paymentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du paiement');
    }
  },

  // Récupérer tous les paiements
  getAll: async (): Promise<Payment[]> => {
    try {
      const response = await api.get(BASE_URL);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des paiements');
    }
  },

  // Récupérer les paiements d'un étudiant
  getByStudent: async (studentId: string): Promise<Payment[]> => {
    try {
      const response = await api.get(`${BASE_URL}/student/${studentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération des paiements de l'étudiant");
    }
  },

  // Récupérer le total des paiements d'un étudiant pour une année académique
  getTotalByStudent: async (studentId: string, academicYear: string): Promise<number> => {
    try {
      const response = await api.get(`${BASE_URL}/student/${studentId}/total`, {
        params: { academicYear }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du calcul du total des paiements');
    }
  },

  // Récupérer les paiements avec pagination
  getAllPaginated: async (page = 0, size = 10, sort = 'createdAt,desc'): Promise<any> => {
    try {
      const response = await api.get(BASE_URL, {
        params: { page, size, sort }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des paiements');
    }
  },

  // Récupérer les paiements par période
  getByDateRange: async (startDate: string, endDate: string, page = 0, size = 10): Promise<any> => {
    try {
      const response = await api.get(`${BASE_URL}/date-range`, {
        params: { startDate, endDate, page, size }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des paiements par période');
    }
  },

  // Récupérer les statistiques des paiements
  getStats: async (startDate: string, endDate: string): Promise<any> => {
    try {
      const response = await api.get(`${BASE_URL}/stats`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  },

  // Récupérer les paiements en retard
  getOverdue: async (): Promise<Payment[]> => {
    try {
      const response = await api.get(`${BASE_URL}/overdue`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des paiements en retard');
    }
  },

  // Récupérer le résumé des paiements par mois
  getMonthlySummary: async (year: string): Promise<any> => {
    try {
      const response = await api.get(`${BASE_URL}/monthly-summary`, {
        params: { year }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du résumé mensuel');
    }
  },

  // Marquer un paiement comme vérifié
  markAsVerified: async (paymentId: string): Promise<Payment> => {
    try {
      const response = await api.put(`${BASE_URL}/${paymentId}/verify`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du paiement');
    }
  },

  // Annuler un paiement
  cancel: async (paymentId: string, reason: string): Promise<Payment> => {
    try {
      const response = await api.put(`${BASE_URL}/${paymentId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur lors de l'annulation du paiement");
    }
  },

  // Générer un reçu de paiement
  generateReceipt: async (paymentId: string): Promise<Blob> => {
    try {
      const response = await api.get(`${BASE_URL}/${paymentId}/receipt`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la génération du reçu');
    }
  }
};

export default paymentService;