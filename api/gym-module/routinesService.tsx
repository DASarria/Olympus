/* eslint-disable @typescript-eslint/no-explicit-any */
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
  equipment: any;
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
  id: string;
  name: string;
  description: string;
  difficulty: string;
  goal: string;
  trainerId: string;
  creationDate: string;
  exercises: RoutineExerciseDTO[];
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
  id: string;
  name: string;
  description: string;
  difficulty: string;
  goal: string;
  trainerId: string;
  creationDate: string;
  exercises: RoutineExercise[];
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
    console.log(`Fetching current routine for user: ${userId}`);
    // Get all routines and return the first one as current
    // This is a workaround until the backend /current endpoint is implemented
    const routines = await getUserRoutines(userId);
    if (routines && routines.length > 0) {
      console.log("Using first routine as current routine:", routines[0]?.name || 'No name');
      return routines[0];
    }
    // If no routines found, throw a 404 error to maintain consistent behavior
    throw { response: { status: 404 } };
  } catch (error: any) {
    console.error(`Error fetching current routine for user ${userId}:`, error);
    
    // Check for 404 error which might indicate no current routine
    if (error.response?.status === 404) {
      console.warn(`No current routine found for user ${userId}`);
      return null; // Return null instead of throwing an error
    }
    
    // If the error message mentions specific common errors, handle gracefully
    if (error.response?.data?.message?.toLowerCase().includes("error al obtener la rutina actual") ||
        error.message?.toLowerCase().includes("error al obtener la rutina actual") ||
        error.response?.data?.message?.toLowerCase().includes("usuario no encontrado") ||
        error.message?.toLowerCase().includes("usuario no encontrado")) {
      console.warn(`Error getting current routine for user: ${userId}`);
      return null; // Return null for errors getting the routine
    }
    
    // For all other errors, log but don't throw to prevent app breaking
    console.error("Other error in getCurrentRoutine:", error);
    return null; // Return null instead of throwing
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
    console.log(`Creating custom routine for user ${userId}:`, routineDTO);
    
    // Validate user ID
    if (!userId) {
      throw new Error("Se requiere un ID de usuario válido para crear una rutina");
    }
    
    // Validate routine name
    if (!routineDTO.name) {
      throw new Error("La rutina debe tener un nombre");
    }
    
    // Make sure exercises have valid IDs
    if (routineDTO.exercises) {
      routineDTO.exercises = routineDTO.exercises.filter(ex => 
        ex.baseExerciseId && ex.baseExerciseId.trim() !== ''
      );
      
      // Validate exercise parameters
      routineDTO.exercises = routineDTO.exercises.map(ex => ({
        ...ex,
        sets: ex.sets || 3,
        repetitions: ex.repetitions || 12,
        restTime: ex.restTime || 60,
        sequenceOrder: ex.sequenceOrder || 1
      }));
    }
    
    // Validate there are exercises in the routine
    if (!routineDTO.exercises || routineDTO.exercises.length === 0) {
      throw new Error("La rutina debe tener al menos un ejercicio");
    }
    
    // Add trainer ID if not present
    if (!routineDTO.trainerId && typeof window !== 'undefined') {
      const trainerId = sessionStorage.getItem("id");
      if (trainerId) {
        routineDTO.trainerId = trainerId;
        console.log(`Added trainer ID from session: ${trainerId}`);
      }
    }
    
    // Send the request to create the custom routine
    console.log("Sending request to create custom routine:", routineDTO);
    const response = await api.post<Routine>(`${USER_API}/${userId}/routines/custom`, routineDTO);
    console.log("Custom routine created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating custom routine:", error);
    
    if (error.response?.status === 400) {
      throw new Error("Datos de rutina inválidos: " + (error.response?.data?.message || "Verifique los campos requeridos"));
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("No tiene permisos para crear rutinas para este usuario");
    } else if (error.response?.status === 404) {
      throw new Error("Usuario o ejercicios no encontrados. Verifique los IDs.");
    } else {
      throw new Error(error.response?.data?.message || error.message || "Error al crear la rutina personalizada");
    }
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
    console.log(`Fetching recommended routines for user: ${userId}`);
    const response = await api.get<Routine[]>(`${USER_API}/${userId}/recommended-routines`);
    console.log(`Successfully retrieved ${response.data.length} recommended routines`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching recommended routines for user ${userId}:`, error);
    
    // Check for 404 error which might indicate no routines exist rather than a true error
    if (error.response?.status === 404) {
      console.warn(`No recommended routines found for user ${userId}`);
      return []; // Return empty array instead of throwing an error
    }
    
    // If the error message mentions "usuario no encontrado", return empty array
    if (error.response?.data?.message?.toLowerCase().includes("usuario no encontrado") ||
        error.message?.toLowerCase().includes("usuario no encontrado")) {
      console.warn(`User not found when fetching recommended routines: ${userId}`);
      return []; // Return empty array for missing user
    }
    
    // For other errors, log but don't throw to prevent app breaking
    console.error("Other error in getRecommendedRoutines:", error);
    return []; // Return empty array instead of throwing
  }
}

/**
 * Sets a routine as the current routine for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} routineId - The unique identifier of the routine to set as current.
 * @returns {Promise<any>} A promise that resolves with the response data after setting the current routine.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function setCurrentRoutine(userId: string, routineId: string) {
  try {
    console.log(`Setting routine ${routineId} as current for user ${userId}`);
    // Fixed endpoint to match backend controller route
    const response = await api.post(`${USER_API}/${userId}/routines/assign/${routineId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error setting current routine for user ${userId}:`, error);
    throw new Error(error.response?.data?.message || "Error al establecer la rutina actual");
  }
}