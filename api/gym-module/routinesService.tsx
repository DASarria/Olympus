import api from "@/api/axiosInstance";
const USER_API = "/users";

/**
 * @typedef {Object} RoutineExerciseDTO
 * @property {string} [id] - The unique identifier for the routine exercise (optional).
 * @property {string} [routineId] - The unique identifier of the routine to which this exercise belongs (optional).
 * @property {string} [baseExerciseId] - The unique identifier of the base exercise (optional).
 * @property {number} [sets] - The number of sets for the exercise (optional).
 * @property {number} [repetitions] - The number of repetitions per set (optional).
 * @property {number} [restTime] - The rest time between sets in seconds (optional).
 * @property {number} [sequenceOrder] - The order in which the exercise appears in the routine (optional).
 */
export interface RoutineExerciseDTO {
  id?: string;
  routineId?: string;
  baseExerciseId?: string;
  sets?: number;
  repetitions?: number;
  restTime?: number;
  sequenceOrder?: number;
}

/**
 * @typedef {Object} RoutineExercise
 * @property {string} [id] - The unique identifier of the routine exercise (optional).
 * @property {string} [routineId] - The unique identifier of the routine to which this exercise belongs (optional).
 * @property {string} [baseExerciseId] - The unique identifier of the base exercise (optional).
 * @property {string} [name] - The name of the exercise (optional).
 * @property {string} [description] - A description of the exercise (optional).
 * @property {string} [muscleGroup] - The muscle group targeted by the exercise (optional).
 * @property {number} [sets] - The number of sets for the exercise (optional).
 * @property {number} [repetitions] - The number of repetitions per set (optional).
 * @property {number} [restTime] - The rest time between sets in seconds (optional).
 * @property {number} [sequenceOrder] - The order in which the exercise appears in the routine (optional).
 * @property {string} [imageUrl] - URL to an image demonstrating the exercise (optional).
 * @property {string} [videoUrl] - URL to a video demonstrating the exercise (optional).
 */
export interface RoutineExercise {
  id?: string;
  routineId?: string;
  baseExerciseId?: string;
  name?: string;
  description?: string;
  muscleGroup?: string;
  sets?: number;
  repetitions?: number;
  restTime?: number;
  sequenceOrder?: number;
  imageUrl?: string;
  videoUrl?: string;
}

/**
 * @typedef {Object} RoutineDTO
 * @property {string} [id] - The unique identifier of the routine (optional).
 * @property {string} [name] - The name of the routine (optional).
 * @property {string} [description] - A description of the routine (optional).
 * @property {string} [difficulty] - The difficulty level of the routine (optional).
 * @property {string} [goal] - The goal that the routine is intended to achieve (optional).
 * @property {string} [trainerId] - The unique identifier of the trainer who created the routine (optional).
 * @property {string} [creationDate] - The date when the routine was created (optional).
 * @property {RoutineExerciseDTO[]} [exercises] - A list of exercises included in the routine (optional).
 */
export interface RoutineDTO {
  id?: string;
  name?: string;
  description?: string;
  difficulty?: string;
  goal?: string;
  trainerId?: string;
  creationDate?: string;
  exercises?: RoutineExerciseDTO[];
}

/**
 * @typedef {Object} Routine
 * @property {string} [id] - The unique identifier of the routine (optional).
 * @property {string} [name] - The name of the routine (optional).
 * @property {string} [description] - A description of the routine (optional).
 * @property {string} [difficulty] - The difficulty level of the routine (optional).
 * @property {string} [goal] - The goal that the routine is intended to achieve (optional).
 * @property {string} [trainerId] - The unique identifier of the trainer who created the routine (optional).
 * @property {string} [creationDate] - The date when the routine was created (optional).
 * @property {RoutineExercise[]} [exercises] - A list of exercises included in the routine (optional).
 */
export interface Routine {
  id?: string;
  name?: string;
  description?: string;
  difficulty?: string;
  goal?: string;
  trainerId?: string;
  creationDate?: string;
  exercises?: RoutineExercise[];
}

/**
 * Fetches all routines assigned to a user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Routine[]>} A promise that resolves with a list of the user's routines.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getUserRoutines(userId: string) {
  try {
    const response = await api.get<Routine[]>(`${USER_API}/${userId}/routines`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener las rutinas del usuario");
  }
}


/**
 * Fetches the current routine assigned to a user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Routine>} A promise that resolves with the user's current routine.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getCurrentRoutine(userId: string) {
  try {
    const response = await api.get<Routine>(`${USER_API}/${userId}/routines/current`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener la rutina actual");
  }
}

/**
 * Assigns an existing routine to a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} routineId - The unique identifier of the routine to assign.
 * @returns {Promise<any>} A promise that resolves with the response data after assigning the routine.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function assignRoutineToUser(userId: string, routineId: string) {
  try {
    const response = await api.post(`${USER_API}/${userId}/routines/assign/${routineId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al asignar la rutina");
  }
}

/**
 * Creates a custom routine for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {RoutineDTO} routineDTO - The custom routine data to create.
 * @returns {Promise<Routine>} A promise that resolves with the newly created routine.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function createCustomRoutine(userId: string, routineDTO: RoutineDTO) {
  try {
    const response = await api.post<Routine>(`${USER_API}/${userId}/routines/custom`, routineDTO);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear la rutina personalizada");
  }
}


/**
 * Updates an existing routine.
 * @param {string} routineId - The unique identifier of the routine to update.
 * @param {RoutineDTO} routineDTO - The updated routine data.
 * @returns {Promise<Routine>} A promise that resolves with the updated routine.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updateRoutine(routineId: string, routineDTO: RoutineDTO) {
  try {
    const response = await api.put<Routine>(`${USER_API}/routines/${routineId}`, routineDTO);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar la rutina");
  }
}

/**
 * Logs the progress of a routine for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} routineId - The unique identifier of the routine.
 * @param {number} [completed=100] - The percentage of the routine that was completed (default is 100%).
 * @returns {Promise<any>} A promise that resolves with the response data after logging the progress.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function logRoutineProgress(userId: string, routineId: string, completed: number = 100) {
  try {
    const response = await api.post(`${USER_API}/${userId}/routines/${routineId}/progress`, { completed });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al registrar el progreso de la rutina");
  }
}

/**
 * Fetches the recommended routines for a user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Routine[]>} A promise that resolves with a list of recommended routines for the user.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getRecommendedRoutines(userId: string) {
  try {
    const response = await api.get<Routine[]>(`${USER_API}/${userId}/recommended-routines`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener las rutinas recomendadas");
  }
}