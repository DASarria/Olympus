/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../axiosInstance';
import { 
  BodyMeasurements, 
  CreatePhysicalMeasurementDTO, 
  PhysicalProgress, 
  ProgressMetrics, 
  SetGoalDTO,
  Weight,
  AdditionalMeasurements
} from '@/types/gym/physicalTracking';
import { calculateBMI } from '@/utils/physicalTrackingUtils';

/**
 * Registra una nueva medición física para un usuario
 */
export async function recordPhysicalMeasurement(
  userId: string, 
  data: CreatePhysicalMeasurementDTO
): Promise<PhysicalProgress> {
  try {
    // Pre-calcular el BMI antes de enviar si hay suficientes datos
    if (data.weight?.value && data.measurements?.height) {
      const bmi = calculateBMI(data.weight, data.measurements.height);
      const enrichedData = { ...data, bmi };
      const response = await api.post(`/users/${userId}/physical-progress`, enrichedData);
      return response.data;
    }

    const response = await api.post(`/users/${userId}/physical-progress`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error al registrar medición física:", error);
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
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get(`/users/${userId}/physical-progress`, { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    
    console.warn("Error al obtener historial de mediciones:", error);
    return [];
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
    if (error.response?.status === 404 || error.response?.status === 500) {
      console.warn(`Error ${error.response?.status} al obtener la última medición:`, error);
      return null;
    }
    
    console.error("Error al obtener la última medición:", error);
    // Evitar el uso del mensaje del servidor que puede contener errores de serialización
    return null;
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
    console.error("Error al actualizar medidas:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar las medidas");
  }
}

/**
 * Actualiza el peso en una medición existente
 */
export async function updateWeight(
  progressId: string,
  weight: Weight
): Promise<PhysicalProgress> {
  try {
    const response = await api.put(`/users/physical-progress/${progressId}/weight`, weight);
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar peso:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar el peso");
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
    console.error("Error al establecer meta física:", error);
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
    if (error.response?.status === 404) {
      return {};
    }
    
    // Datos simulados para desarrollo/fallback
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
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get(`/users/trainer/${trainerId}/users/${userId}/physical-progress`, { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    
    console.error("Error al obtener progreso del usuario:", error);
    throw new Error(error.response?.data?.message || "Error al obtener progreso del usuario asignado");
  }
}

/**
 * Añade una observación a una medición física existente
 */
export async function addObservationToProgress(
  progressId: string,
  observation: string
): Promise<PhysicalProgress> {
  try {
    const response = await api.post(`/users/physical-progress/${progressId}/observations`, { observation });
    return response.data;
  } catch (error: any) {
    console.error("Error al añadir observación:", error);
    throw new Error(error.response?.data?.message || "Error al añadir observación");
  }
}

/**
 * Elimina una medición física
 */
export async function deletePhysicalProgress(
  progressId: string
): Promise<void> {
  try {
    await api.delete(`/users/physical-progress/${progressId}`);
  } catch (error: any) {
    console.error("Error al eliminar medición física:", error);
    throw new Error(error.response?.data?.message || "Error al eliminar la medición física");
  }
}

/**
 * Compara el progreso físico entre dos fechas
 */
export async function comparePhysicalProgress(
  userId: string,
  startDate: string,
  endDate: string
): Promise<ProgressMetrics> {
  try {
    const response = await api.get(`/users/${userId}/physical-progress/compare`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {};
    }
    
    console.error("Error al comparar progreso físico:", error);
    throw new Error(error.response?.data?.message || "Error al comparar progreso físico");
  }
}