import api from "@/api/axiosInstance";
const USER_API = "/users";


/**
 * @typedef {Object} BaseExerciseDTO
 * @property {string} [id] - The unique identifier of the exercise (optional).
 * @property {string} name - The name of the exercise.
 * @property {string} [description] - A description of the exercise (optional).
 * @property {string} muscleGroup - The muscle group the exercise targets.
 * @property {string} equipment - The equipment needed for the exercise.
 * @property {string} [videoUrl] - The URL of the video demonstrating the exercise (optional).
 * @property {string} [imageUrl] - The URL of an image representing the exercise (optional).
 */
export interface BaseExerciseDTO {
    id?: string;
    name: string;
    description?: string;
    muscleGroup: string;
    equipment: string;
    videoUrl?: string;
    imageUrl?: string;
}

/**
 * @typedef {Object} BaseExercise
 * @property {string} [name] - The name of the exercise (optional).
 * @property {string} [description] - A description of the exercise (optional).
 * @property {string} muscleGroup - The muscle group the exercise targets.
 * @property {string} equipment - The equipment needed for the exercise.
 * @property {string} [videoUrl] - The URL of the video demonstrating the exercise (optional).
 * @property {string} [imageUrl] - The URL of an image representing the exercise (optional).
 */
export interface BaseExercise {
    name?: string;
    description?: string;
    muscleGroup: string;
    equipment: string;
    videoUrl?: string;
    imageUrl?: string;
}

/**
 * Fetches a list of all available exercises.
 * @returns {Promise<BaseExercise[]>} A promise that resolves with a list of exercises.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getAllExercises() {
  try {
    const response = await api.get<BaseExercise[]>(`${USER_API}/exercises`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener los ejercicios");
  }
}

/**
 * Fetches a specific exercise by its ID.
 * @param {string} id - The unique identifier of the exercise.
 * @returns {Promise<BaseExercise>} A promise that resolves with the exercise data.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getExerciseById(id: string) {
  try {
    const response = await api.get<BaseExercise>(`${USER_API}/exercises/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener el ejercicio");
  }
}


/**
 * Fetches a list of exercises that target a specific muscle group.
 * @param {string} muscleGroup - The muscle group to filter exercises by (e.g., "chest", "legs").
 * @returns {Promise<BaseExercise[]>} A promise that resolves with a list of exercises.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getExercisesByMuscleGroup(muscleGroup: string) {
  try {
    const response = await api.get<BaseExercise[]>(`${USER_API}/exercises/muscle-group/${muscleGroup}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener ejercicios por grupo muscular");
  }
}

/**
 * Searches for exercises by their name.
 * @param {string} name - The name of the exercise to search for.
 * @returns {Promise<BaseExercise[]>} A promise that resolves with a list of matching exercises.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function searchExercisesByName(name: string) {
  try {
    const response = await api.get<BaseExercise[]>(`${USER_API}/exercises/search?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al buscar ejercicios por nombre");
  }
}

/**
 * Creates a new exercise.
 * @param {BaseExerciseDTO} exerciseDTO - The data transfer object containing the exercise details.
 * @returns {Promise<BaseExercise>} A promise that resolves with the created exercise.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function createExercise(exerciseDTO: BaseExerciseDTO) {
  try {
    const response = await api.post<BaseExercise>(`${USER_API}/exercises`, exerciseDTO);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear el ejercicio");
  }
}

/**
 * Updates an existing exercise.
 * @param {string} id - The ID of the exercise to update.
 * @param {BaseExerciseDTO} exerciseDTO - The data to update the exercise with.
 * @returns {Promise<BaseExercise>} A promise that resolves with the updated exercise.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updateExercise(id: string, exerciseDTO: BaseExerciseDTO) {
  try {
    const response = await api.put<BaseExercise>(`${USER_API}/exercises/${id}`, exerciseDTO);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar el ejercicio");
  }
}

/**
 * Deletes an exercise by its ID.
 * @param {string} id - The ID of the exercise to delete.
 * @returns {Promise<void>} A promise that resolves when the exercise is deleted.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function deleteExercise(id: string) {
  try {
    const response = await api.delete(`${USER_API}/exercises/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al eliminar el ejercicio");
  }
}