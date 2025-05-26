import api from './api';

export interface ReporteRequest {
  type: 'student' | 'equipment' | 'status' | 'hourly' | 'daterange';
  value?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReporteResponse {
  reportType: string;
  reportValue?: string;
  startDate?: string;
  endDate?: string;
  totalItems: number;
  data: any[];
}

export interface EstadisticasResponse {
  totalArticulos: number;
  estadisticas: Array<{
    id: number;
    name: string;
    description: string;
    articleStatus: string;
    imageUrl: string;
    vecesPrestado: number;
  }>;
  reportId?: string;
  downloadLinks?: {
    pdf: string;
    excel: string;
  };
}

export const reportesService = {
  // Generar reporte de préstamos
  generarReporte: async (request: ReporteRequest): Promise<ReporteResponse> => {
    let url = `/LoanArticle/reports?type=${request.type}`;
   
    if (request.value) {
      url += `&value=${encodeURIComponent(request.value)}`;
    }
   
    if (request.startDate && request.endDate) {
      url += `&startDate=${request.startDate}&endDate=${request.endDate}`;
    }
   
    const response = await api.get(url);
    return response.data;
  },

  // Obtener estadísticas de artículos
  obtenerEstadisticas: async (username?: string): Promise<EstadisticasResponse> => {
    let url = '/Article/stats';
    if (username) {
      url += `?username=${encodeURIComponent(username)}`;
    }
   
    const response = await api.get(url);
    return response.data;
  },

  // Descargar archivo PDF de estadísticas
  descargarPDF: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/Article/stats/pdf/${reportId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Descargar archivo Excel de estadísticas
  descargarExcel: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/Article/stats/excel/${reportId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportesService;
