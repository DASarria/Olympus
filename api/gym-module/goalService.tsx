import api from '../axiosInstance';

/**
 * Obtiene todas las metas físicas de un usuario
 */
export async function getUserGoals(userId: string): Promise<string[]> {
  try {
    const response = await api.get(`/users/${userId}/goals`);
    
    // Si el endpoint devuelve un array de strings, retornarlo directamente
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si el endpoint devuelve objetos con una propiedad goal, extraer solo las metas
    if (Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] === 'object') {
      return response.data.map((item: any) => item.goal || '').filter(Boolean);
    }
    
    // Fallback: Si el formato no es reconocido
    return [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    
    console.warn("Error al obtener metas del usuario:", error);
    return [];
  }
}

/**
 * Establece múltiples metas físicas para un usuario
 */
export async function setUserGoals(userId: string, goals: string[]): Promise<boolean> {
  try {
    await api.post(`/users/${userId}/goals`, { goals });
    return true;
  } catch (error: any) {
    console.error("Error al establecer metas:", error);
    throw new Error(error.response?.data?.message || "Error al establecer metas del usuario");
  }
}

/**
 * Elimina una meta física específica
 */
export async function deleteUserGoal(userId: string, goalId: string): Promise<boolean> {
  try {
    await api.delete(`/users/${userId}/goals/${goalId}`);
    return true;
  } catch (error: any) {
    console.error("Error al eliminar meta:", error);
    throw new Error(error.response?.data?.message || "Error al eliminar meta del usuario");
  }
}