/* eslint-disable @typescript-eslint/no-explicit-any */
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
 * @property {string} id - The unique identifier of the exercise.
 * @property {string} [name] - The name of the exercise (optional).
 * @property {string} [description] - A description of the exercise (optional).
 * @property {string} muscleGroup - The muscle group the exercise targets.
 * @property {string} equipment - The equipment needed for the exercise.
 * @property {string} [videoUrl] - The URL of the video demonstrating the exercise (optional).
 * @property {string} [imageUrl] - The URL of an image representing the exercise (optional).
 */
export interface BaseExercise {
    id: string;  // Changed from optional to required
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
    
    // Ensure all exercises have an ID to avoid errors in the UI
    const validExercises = response.data.filter(exercise => {
      if (!exercise.id) {
        console.warn("Found exercise without ID, filtering it out:", exercise);
        return false;
      }
      return true;
    });
    
    console.log(`Fetched ${validExercises.length} valid exercises`);
    return validExercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw new Error(error instanceof Error ? error.message : "Error al obtener los ejercicios");
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
    console.log("Validating exercise data:", exerciseDTO);

    // Enhanced field validation with specific error messages
    if (!exerciseDTO.name?.trim()) {
      throw new Error("El nombre del ejercicio es obligatorio");
    }

    if (!exerciseDTO.muscleGroup) {
      throw new Error("El grupo muscular es obligatorio");
    }

    if (!exerciseDTO.equipment) {
      throw new Error("El tipo de equipamiento es obligatorio");
    }

    // Cleanup the data before sending
    const cleanedDTO = {
      ...exerciseDTO,
      name: exerciseDTO.name.trim(),
      description: exerciseDTO.description?.trim(),
      muscleGroup: exerciseDTO.muscleGroup.toUpperCase(),
      equipment: exerciseDTO.equipment.toUpperCase(),
      imageUrl: exerciseDTO.imageUrl?.trim(),
      videoUrl: exerciseDTO.videoUrl?.trim()
    };

    console.log("Creating exercise with cleaned data:", cleanedDTO);

    // Make API call to create exercise
    const response = await api.post<BaseExercise>(`${USER_API}/exercises`, cleanedDTO);
    
    // Validate response
    if (!response.data) {
      throw new Error("No se recibió respuesta del servidor");
    }

    if (!response.data.id) {
      console.error("Created exercise is missing an ID:", response.data);
      throw new Error("The created exercise does not have a valid ID");
    }
    
    console.log("Exercise created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in createExercise:", error);
    if (error.response?.status === 400) {
      throw new Error("Datos de ejercicio inválidos: " + (error.response?.data?.message || "Verifique los campos requeridos"));
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("No tiene permisos para crear ejercicios");
    } else {
      throw new Error(error.response?.data?.message || error.message || "Error al crear el ejercicio");
    }
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

/**
 * Maps a zone ID from the 3D model to a backend muscle group name.
 * This is needed to translate between the frontend zone IDs and backend muscle group strings.
 * 
 * @param {number} zoneId - The zone ID from the 3D model
 * @returns {string} The corresponding muscle group name used in the backend
 */
export function mapZoneIdToMuscleGroup(zoneId: number): string {
  const muscleGroups: Record<number, string> = {
    1: 'pecho',
    2: 'espalda',
    3: 'bíceps',
    4: 'tríceps',
    5: 'hombros',
    6: 'abdomen',
    7: 'glúteos',
    8: 'cuádriceps',
    9: 'isquiotibiales',
    10: 'pantorrillas',
  };

  return muscleGroups[zoneId] || '';
}

/**
 * Maps a backend muscle group name to a zone ID for the 3D model.
 * 
 * @param {string} muscleGroup - The muscle group name from the backend
 * @returns {number|null} The corresponding zone ID for the 3D model, or null if not found
 */
export function mapMuscleGroupToZoneId(muscleGroup: string): number | null {
  const lowerCaseMuscleGroup = muscleGroup.toLowerCase();
  
  const zoneIds: Record<string, number> = {
    'pecho': 1,
    'espalda': 2,
    'bíceps': 3,
    'biceps': 3,
    'tríceps': 4,
    'triceps': 4,
    'hombros': 5,
    'abdomen': 6,
    'glúteos': 7,
    'gluteos': 7,
    'cuádriceps': 8,
    'cuadriceps': 8,
    'isquiotibiales': 9,
    'pantorrillas': 10,
  };

  return zoneIds[lowerCaseMuscleGroup] || null;
}