import api from "@/pages/api/axiosInstance";
const USER_API = "/users";

/**
 * @typedef {Object} BodyMeasurementsDTO
 * @property {number} [height] - The height of the user (optional).
 * @property {number} [chestCircumference] - The chest circumference (optional).
 * @property {number} [waistCircumference] - The waist circumference (optional).
 * @property {number} [hipCircumference] - The hip circumference (optional).
 * @property {number} [bicepsCircumference] - The biceps circumference (optional).
 * @property {number} [thighCircumference] - The thigh circumference (optional).
 */
export interface BodyMeasurementsDTO {
  height?: number;
  chestCircumference?: number;
  waistCircumference?: number;
  hipCircumference?: number;
  bicepsCircumference?: number;
  thighCircumference?: number;
}

/**
 * @typedef {Object} PhysicalProgress
 * @property {string} id - The unique identifier of the physical progress record.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} date - The date the progress was recorded (ISO format).
 * @property {BodyMeasurementsDTO} measurements - The body measurements at the time of progress recording.
 * @property {string} [goal] - The goal set for the user (optional).
 */
export interface PhysicalProgress {
  id: string;
  userId: string;
  date: string;
  measurements: BodyMeasurementsDTO;
  goal?: string;
}


/**
 * @typedef {Object} ProgressMetrics
 * @property {string} [key] - A dynamic key for a specific measurement (e.g., "height").
 * @property {number} [value] - The corresponding value for the metric (e.g., "175" for height).
 */
export interface ProgressMetrics {
  [key: string]: number;
}


/**
 * Records a physical measurement for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {any} progressDTO - The physical progress data to be recorded (can include measurements and goal).
 * @returns {Promise<PhysicalProgress>} A promise that resolves with the newly created physical progress record.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function recordPhysicalMeasurement(userId: string, progressDTO: any) {
    try {
        const response = await api.post(`${USER_API}/${userId}/physical-progress`, progressDTO);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al registrar progreso físico");
    }
}

/**
 * Fetches the user's physical measurement history.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} [startDate] - The start date for filtering the progress records (optional).
 * @param {string} [endDate] - The end date for filtering the progress records (optional).
 * @returns {Promise<PhysicalProgress[]>} A promise that resolves with a list of physical progress records.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getPhysicalMeasurementHistory(userId: string, startDate?: string, endDate?: string): Promise<PhysicalProgress[]> {
  try {
    const response = await api.get(`/users/${userId}/physical-progress`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener historial de medidas.");
  }
}

/**
 * Fetches the latest physical measurement for a user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<PhysicalProgress>} A promise that resolves with the latest physical progress record.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getLatestPhysicalMeasurement(userId: string): Promise<PhysicalProgress> {
  try {
    const response = await api.get(`/users/${userId}/physical-progress/latest`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener la última medida.");
  }
}

/**
 * Updates the physical measurements of a specific progress record.
 * @param {string} progressId - The unique identifier of the progress record to update.
 * @param {BodyMeasurementsDTO} measurements - The updated body measurements data.
 * @returns {Promise<PhysicalProgress>} A promise that resolves with the updated physical progress record.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updatePhysicalMeasurements(progressId: string, measurements: BodyMeasurementsDTO): Promise<PhysicalProgress> {
  try {
    const response = await api.put(`/users/physical-progress/${progressId}/measurements`, measurements);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar las medidas.");
  }
}

/**
 * Sets a physical goal for the user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} goal - The physical goal to set for the user.
 * @returns {Promise<PhysicalProgress>} A promise that resolves with the updated physical progress record, including the goal.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function setPhysicalGoal(userId: string, goal: string): Promise<PhysicalProgress> {
  try {
    const response = await api.put(`/users/${userId}/physical-progress/goal`, { goal });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al establecer la meta física.");
  }
}

/**
 * Fetches physical progress metrics for a user over a specific period.
 * @param {string} userId - The unique identifier of the user.
 * @param {number} [months=6] - The number of months of data to retrieve (default is 6 months).
 * @returns {Promise<ProgressMetrics>} A promise that resolves with the user's progress metrics.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getPhysicalProgressMetrics(userId: string, months: number = 6): Promise<ProgressMetrics> {
  try {
    const response = await api.get(`/users/${userId}/physical-progress/metrics`, {
      params: { months },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener métricas de progreso.");
  }
}

/**
 * Fetches the physical progress of a user under a specific trainer.
 * @param {string} trainerId - The unique identifier of the trainer.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} [startDate] - The start date for filtering the progress records (optional).
 * @param {string} [endDate] - The end date for filtering the progress records (optional).
 * @returns {Promise<PhysicalProgress[]>} A promise that resolves with a list of physical progress records for the user.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getTraineePhysicalProgress(trainerId: string, userId: string, startDate?: string, endDate?: string): Promise<PhysicalProgress[]> {
  try {
    const response = await api.get(`/users/trainer/${trainerId}/users/${userId}/physical-progress`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener progreso del usuario asignado.");
  }
}