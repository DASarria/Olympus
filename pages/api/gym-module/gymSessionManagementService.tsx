import api from "@/pages/api/axiosInstance";
const USER_API = "/users";

/**
 * @typedef {Object} GymSessionDTO
 * @description Represents the details of a gym session.
 * @property {string} id - The unique identifier of the gym session.
 * @property {string} sessionDate - The date when the gym session occurs.
 * @property {string} startTime - The start time of the gym session.
 * @property {string} endTime - The end time of the gym session.
 * @property {number} capacity - The total capacity of the gym session.
 * @property {number} reservedSpots - The number of spots already reserved for the session.
 * @property {string} trainerId - The unique identifier of the trainer leading the session.
 * @property {string} sessionType - The type of the session (e.g., yoga, strength training).
 * @property {string} location - The location where the gym session takes place.
 * @property {string} description - A description of the gym session.
 */
export interface GymSessionDTO {
    id: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    capacity: number;
    reservedSpots: number;
    trainerId: string;
    sessionType: string;
    location: string;
    description: string;
}

/**
 * @typedef {Object} RecurringSessionDTO
 * @description Represents the details of a recurring gym session.
 * @property {number} dayOfWeek - The day of the week for the recurring session (0 for Sunday, 1 for Monday, etc.).
 * @property {string} startTime - The start time of the recurring session.
 * @property {string} endTime - The end time of the recurring session.
 * @property {number} capacity - The total capacity of the recurring session.
 * @property {string} startDate - The start date of the recurring session.
 * @property {string} endDate - The end date of the recurring session.
 * @property {string} trainerId - The unique identifier of the trainer leading the session.
 * @property {string} [description] - A description of the recurring session (optional).
 */
export interface RecurringSessionDTO {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    capacity: number;
    startDate: string;
    endDate: string;
    trainerId: string;
    description?: string;
}


/**
 * @typedef {Object} CreateSessionDTO
 * @description Represents the data needed to create a new gym session.
 * @property {string} date - The date for the new gym session.
 * @property {string} startTime - The start time of the new gym session.
 * @property {string} endTime - The end time of the new gym session.
 * @property {number} capacity - The total capacity for the new gym session.
 * @property {string} trainerId - The unique identifier of the trainer leading the session.
 * @property {string} [description] - A description of the new gym session (optional).
 */
export interface CreateSessionDTO {
    date: string;
    startTime: string;
    endTime: string;
    capacity: number;
    trainerId: string;
    description?: string;
}

/**
 * @typedef {Object} UpdateSessionDTO
 * @description Represents the data needed to update an existing gym session.
 * @property {string} date - The date for the gym session.
 * @property {string} startTime - The start time of the gym session.
 * @property {string} endTime - The end time of the gym session.
 * @property {number} capacity - The total capacity for the gym session.
 * @property {string} trainerId - The unique identifier of the trainer leading the session.
 */
export interface UpdateSessionDTO {
    date: string;
    startTime: string;
    endTime: string;
    capacity: number;
    trainerId: string;
}


/**
 * @typedef {Object} CancelSessionDTO
 * @description Represents the data needed to cancel an existing gym session.
 * @property {string} [reason] - The reason for canceling the gym session (optional).
 * @property {string} trainerId - The unique identifier of the trainer leading the session.
 */
export interface CancelSessionDTO {
    reason?: string;
    trainerId: string;
}

/**
 * Creates a new gym session.
 * @param {CreateSessionDTO} data - The data to create a new gym session.
 * @returns {Promise<{ sessionId: string; message: string }>} A promise that resolves with the session ID and a message.
 * @throws {Error} Throws an error if the session cannot be created.
 */
export async function createSession(data: CreateSessionDTO): Promise<{ sessionId: string; message: string }> {
  try {
    const response = await api.post<{ sessionId: string; message: string }>(`${USER_API}/trainer/sessions`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al crear la sesión');
  }
}

/**
 * Updates an existing gym session.
 * @param {string} sessionId - The unique identifier of the gym session to update.
 * @param {UpdateSessionDTO} data - The data to update the gym session with.
 * @returns {Promise<{ message: string }>} A promise that resolves with a message confirming the update.
 * @throws {Error} Throws an error if the session cannot be updated.
 */
export async function updateSession(sessionId: string, data: UpdateSessionDTO): Promise<{ message: string }> {
  try {
    const response = await api.put<{ message: string }>(`${USER_API}/trainer/sessions/${sessionId}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Sesión no encontrada');
    }
    throw new Error(error.response?.data?.error || 'Error al actualizar la sesión');
  }
}

/**
 * Cancels an existing gym session.
 * @param {string} sessionId - The unique identifier of the gym session to cancel.
 * @param {CancelSessionDTO} data - The data to cancel the gym session.
 * @returns {Promise<{ message: string }>} A promise that resolves with a message confirming the cancellation.
 * @throws {Error} Throws an error if the session cannot be canceled.
 */
export async function cancelSession(sessionId: string, data: CancelSessionDTO): Promise<{ message: string }> {
  try {
    const response = await api.delete<{ message: string }>(`${USER_API}/trainer/sessions/${sessionId}`, { data });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Sesión no encontrada');
    }
    throw new Error(error.response?.data?.error || 'Error al cancelar la sesión');
  }
}

/**
 * Fetches all gym sessions on a specific date.
 * @param {string} date - The date for which to fetch gym sessions.
 * @returns {Promise<GymSessionDTO[]>} A promise that resolves with an array of gym session data.
 * @throws {Error} Throws an error if the sessions cannot be fetched.
 */
export async function getSessionsByDate(date: string): Promise<GymSessionDTO[]> {
  try {
    const response = await api.get<GymSessionDTO[]>(`${USER_API}/trainer/sessions`, { params: { date } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al obtener sesiones por fecha');
  }
}

/**
 * Fetches all gym sessions led by a specific trainer.
 * @param {string} trainerId - The unique identifier of the trainer whose sessions are to be fetched.
 * @returns {Promise<GymSessionDTO[]>} A promise that resolves with an array of gym session data.
 * @throws {Error} Throws an error if the sessions cannot be fetched.
 */
export async function getTrainerSessions(trainerId: string): Promise<GymSessionDTO[]> {
  try {
    const response = await api.get<GymSessionDTO[]>(`${USER_API}/trainer/${trainerId}/sessions`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al obtener sesiones del entrenador');
  }
}

/**
 * Creates multiple recurring gym sessions.
 * @param {RecurringSessionDTO} data - The data to create the recurring sessions.
 * @returns {Promise<{ sessionsCreated: number; message: string }>} A promise that resolves with the number of sessions created and a message.
 * @throws {Error} Throws an error if the recurring sessions cannot be created.
 */
export async function createRecurringSessions(data: RecurringSessionDTO): Promise<{ sessionsCreated: number; message: string }> {
  try {
    const response = await api.post<{ sessionsCreated: number; message: string }>(`${USER_API}/trainer/sessions/recurring`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al crear sesiones recurrentes');
  }
}

/**
 * Fetches occupancy statistics for gym sessions between specific dates.
 * @param {string} startDate - The start date for the statistics.
 * @param {string} endDate - The end date for the statistics.
 * @returns {Promise<Record<string, number>>} A promise that resolves with occupancy statistics.
 * @throws {Error} Throws an error if the statistics cannot be fetched.
 */
export async function getOccupancyStatistics(startDate: string, endDate: string): Promise<Record<string, number>> {
  try {
    const response = await api.get<Record<string, number>>(`${USER_API}/trainer/sessions/stats`, { params: { startDate, endDate } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de ocupación');
  }
}
