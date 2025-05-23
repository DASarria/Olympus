import api from "../axiosInstance";
const USER_API = "/users";

/**
 * @enum {string} ReportFormat
 * @description Enum representing the possible formats for the reports.
 * @property {string} CSV - CSV format.
 * @property {string} PDF - PDF format.
 * @property {string} XLSX - XLSX format.
 * @property {string} JSON - JSON format.
 */
export enum ReportFormat {
  CSV = "CSV",
  PDF = "PDF",
  XLSX = "XLSX",
  JSON = "JSON",
}

/**
 * Fetches a user progress report in the specified format.
 * @param {string} userId - The unique identifier of the user whose progress is being reported.
 * @param {ReportFormat} format - The format in which the report should be generated.
 * @returns {Promise<Blob>} A promise that resolves with the Blob data representing the report.
 * @throws {Error} Throws an error if the report cannot be fetched.
 */
export async function getUserProgressReport(userId: string, format: ReportFormat): Promise<Blob> {
  try {
    const response = await api.get<Blob>(`${USER_API}/user-progress`, {
      params: { userId, format },
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al obtener reporte de progreso de usuario');
  }
}

/**
 * Fetches a gym usage report between specific dates in the specified format.
 * @param {string} startDate - The start date for the gym usage report.
 * @param {string} endDate - The end date for the gym usage report.
 * @param {ReportFormat} format - The format in which the report should be generated.
 * @returns {Promise<Blob>} A promise that resolves with the Blob data representing the gym usage report.
 * @throws {Error} Throws an error if the report cannot be fetched.
 */
export async function getGymUsageReport(startDate: string, endDate: string, format: ReportFormat): Promise<Blob> {
  try {
    const response = await api.get<Blob>(`${USER_API}/gym-usage`, {
      params: { startDate, endDate, format },
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al obtener reporte de uso de gimnasio');
  }
}

/**
 * Fetches an attendance report between specific dates in the specified format.
 * @param {string} startDate - The start date for the attendance report.
 * @param {string} endDate - The end date for the attendance report.
 * @param {ReportFormat} format - The format in which the report should be generated.
 * @returns {Promise<Blob>} A promise that resolves with the Blob data representing the attendance report.
 * @throws {Error} Throws an error if the report cannot be fetched.
 */
export async function getAttendanceReport(startDate: string, endDate: string, format: ReportFormat): Promise<Blob> {
  try {
    const response = await api.get<Blob>(`${USER_API}/attendance`, {
      params: { startDate, endDate, format },
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al obtener reporte de asistencia');
  }
}
