import api from './api.service';

const BASE_URL = '/purchases';

type Purchase = Record<string, any>; // Remplace par ton vrai type d'achat
type ApiResponse<T = any> = { data: T };

export const purchaseService = {
  // Créer un nouvel achat
  create: async (purchaseData: Purchase): Promise<any> => {
    const response = await api.post<ApiResponse>(BASE_URL, purchaseData);
    return response.data;
  },

  // Récupérer tous les achats
  getAll: async (): Promise<any> => {
    const response = await api.get<ApiResponse>(BASE_URL);
    return response.data;
  },

  // Récupérer un achat par ID
  getById: async (id: string | number): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Mettre à jour un achat
  update: async (id: string | number, purchaseData: Purchase): Promise<any> => {
    const response = await api.put<ApiResponse>(`${BASE_URL}/${id}`, purchaseData);
    return response.data;
  },

  // Supprimer un achat
  delete: async (id: string | number): Promise<{ message: string }> => {
    await api.delete(`${BASE_URL}/${id}`);
    return { message: 'Achat supprimé avec succès' };
  },

  // Récupérer un achat par numéro de facture
  getByInvoiceNumber: async (invoiceNumber: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/invoice/${invoiceNumber}`);
    return response.data;
  },

  // Récupérer les achats par période
  getByDateRange: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer les achats par période avec pagination
  getByDateRangePaginated: async (
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sort = 'purchaseDate,desc'
  ): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/date-range/paginated`, {
      params: { startDate, endDate, page, size, sort }
    });
    return response.data;
  },

  // Récupérer les achats par fournisseur
  getBySupplier: async (supplier: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/supplier/${supplier}`);
    return response.data;
  },

  // Récupérer les achats par fournisseur avec filtre de date
  getBySupplierWithDateRange: async (
    supplier: string,
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/supplier/${supplier}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer les achats par catégorie
  getByCategory: async (category: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/category/${category}`);
    return response.data;
  },

  // Récupérer les achats par catégorie avec filtre de date
  getByCategoryWithDateRange: async (
    category: string,
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/category/${category}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer le total des achats
  getTotal: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/total`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer le total des achats par fournisseur
  getTotalBySupplier: async (
    supplier: string,
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/total/supplier/${supplier}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer le total des achats par catégorie
  getTotalByCategory: async (
    category: string,
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/total/category/${category}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer le résumé des achats par catégorie
  getSummaryByCategory: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/summary/category`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer le résumé des achats par fournisseur
  getSummaryBySupplier: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/summary/supplier`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Récupérer les statistiques des achats
  getStats: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get<ApiResponse>(`${BASE_URL}/stats`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Exporter les achats en PDF
  exportToPdf: async (startDate: string, endDate: string): Promise<Blob> => {
    const response = await api.get(`${BASE_URL}/export/pdf`, {
      params: { startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  },

  // Exporter les achats en Excel
  exportToExcel: async (startDate: string, endDate: string): Promise<Blob> => {
    const response = await api.get(`${BASE_URL}/export/excel`, {
      params: { startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default purchaseService;
