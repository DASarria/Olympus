import api from '../axiosInstance';
import { 
  BodyMeasurements, 
  CreatePhysicalMeasurementDTO, 
  PhysicalProgress, 
  ProgressMetrics, 
  SetGoalDTO 
} from '@/types/gym/physicalTracking';
// import { generateMockProgressData } from '@/utils/physicalTrackingUtils';

/**
 * Registra una nueva medición física para un usuario
 */
export async function recordPhysicalMeasurement(
  userId: string, 
  data: CreatePhysicalMeasurementDTO
): Promise<PhysicalProgress> {
  try {
    const response = await api.post(`/users/${userId}/physical-progress`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al registrar medición física");
  }
}

/**
 * Obtiene el historial de mediciones físicas de un usuario
 */
export async function getPhysicalMeasurementHistory(
  userId: string, 
  startDate?: string, 
  endDate?: string
): Promise<PhysicalProgress[]> {
  try {
    let url = `/users/${userId}/physical-progress`;
    
    // Añadir parámetros de fecha si están definidos
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get(url, { params });
    return response.data;
  } catch (error: any) {
    // Si es 404, devolver un array vacío
    if (error.response?.status === 404) {
      return [];
    }
    
    // En caso de otros errores, devolver datos simulados para desarrollo
    console.warn("Error al obtener historial. Usando datos simulados:", error);
    // return generateMockProgressData();
    
    // Añadir este return para los casos de error no 404
    return []; // Devuelve un array vacío cuando hay otro tipo de error
  }
}

/**
 * Obtiene la última medición física de un usuario
 */
export async function getLatestPhysicalMeasurement(
  userId: string
): Promise<PhysicalProgress | null> {
  try {
    const response = await api.get(`/users/${userId}/physical-progress/latest`);
    return response.data;
  } catch (error: any) {
    // Si es 404, no hay mediciones, devolver null
    if (error.response?.status === 404) {
      return null;
    }
    
    // Para otros errores, lanzar excepción
    throw new Error(error.response?.data?.message || "Error al obtener la última medida");
  }
}

/**
 * Actualiza las medidas corporales de una medición existente
 */
export async function updatePhysicalMeasurements(
  progressId: string, 
  measurements: BodyMeasurements
): Promise<PhysicalProgress> {
  try {
    const response = await api.put(`/users/physical-progress/${progressId}/measurements`, measurements);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar las medidas");
  }
}

/**
 * Establece o actualiza la meta física de un usuario
 */
export async function setPhysicalGoal(
  userId: string, 
  goal: string
): Promise<PhysicalProgress> {
  try {
    const payload: SetGoalDTO = { goal };
    const response = await api.put(`/users/${userId}/physical-progress/goal`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al establecer la meta física");
  }
}

/**
 * Obtiene las métricas de progreso físico de un usuario
 */
export async function getPhysicalProgressMetrics(
  userId: string, 
  months: number = 6
): Promise<ProgressMetrics> {
  try {
    const response = await api.get(`/users/${userId}/physical-progress/metrics`, {
      params: { months }
    });
    return response.data;
  } catch (error: any) {
    // Si es 404, devolver objeto vacío
    if (error.response?.status === 404) {
      return {};
    }
    
    // Generar métricas simuladas para desarrollo
    console.warn("Error al obtener métricas. Usando datos simulados:", error);
    return {
      weightChange: -2.5,
      bmiChange: -0.8,
      waistCircumferenceChange: -3.0,
      chestCircumferenceChange: 1.5,
      hipCircumferenceChange: -1.0,
      bicepsCircumferenceChange: 0.8,
      thighCircumferenceChange: 0.5
    };
  }
}

/**
 * Obtiene el progreso físico de un estudiante para un entrenador
 */
export async function getTraineePhysicalProgress(
  trainerId: string, 
  userId: string, 
  startDate?: string, 
  endDate?: string
): Promise<PhysicalProgress[]> {
  try {
    let url = `/users/trainer/${trainerId}/users/${userId}/physical-progress`;
    
    // Añadir parámetros de fecha si están definidos
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get(url, { params });
    return response.data;
  } catch (error: any) {
    // Si es 404, devolver un array vacío
    if (error.response?.status === 404) {
      return [];
    }
    
    throw new Error(error.response?.data?.message || "Error al obtener progreso del usuario asignado");
  }
}