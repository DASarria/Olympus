import api from "@/pages/api/axiosInstance";
const USER_API = "/users";

/**
 * @typedef {Object} UserDTO
 * @property {string} [id] - The unique identifier for the user (optional).
 * @property {string} name - The name of the user.
 * @property {number} weight - The weight of the user (in kilograms).
 * @property {number} height - The height of the user (in meters).
 * @property {string} role - The role of the user (e.g., "admin", "user", etc.).
 * @property {string} institutionalId - The institutional ID of the user.
 */
export interface UserDTO {
    id?: string;
    name: string;
    weight: number;
    height: number;
    role: string;
    institutionalId: string;
}

/**
 * Fetches a user by their unique user ID.
 * @param {string} id - The unique identifier for the user.
 * @returns {Promise<UserDTO>} A promise that resolves with the user data.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function getUserById(id: string) {
    try {
        const response = await api.get(`${USER_API}/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al obtener usuario");
    }
}

/**
 * Fetches a user by their institutional ID.
 * @param {string} institutionalId - The institutional ID of the user.
 * @returns {Promise<UserDTO>} A promise that resolves with the user data.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function getUserByInstitutionalId(institutionalId: string) {
    try {
        const response = await api.get(`${USER_API}/by-institutional-id/${institutionalId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al obtener usuario institucional");
    }
}

/**
 * Fetches all users from the system.
 * @returns {Promise<UserDTO[]>} A promise that resolves with an array of users.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function getAllUsers() {
    try {
        const response = await api.get(USER_API);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al obtener usuarios");
    }
}

/**
 * Fetches users by their role.
 * @param {string} role - The role of the users to fetch.
 * @returns {Promise<UserDTO[]>} A promise that resolves with an array of users with the specified role.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function getUsersByRole(role: string) {
    try {
        const response = await api.get(`${USER_API}/by-role/${role}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al obtener usuarios por rol");
    }
}

/**
 * Creates a new user in the system.
 * @param {UserDTO} userDTO - The data for the user to be created.
 * @returns {Promise<UserDTO>} A promise that resolves with the created user's data.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function createUser(userDTO: UserDTO) {
    try {
        const response = await api.post(USER_API, userDTO);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al crear usuario");
    }
}

/**
 * Updates an existing user's data.
 * @param {string} id - The unique identifier of the user to update.
 * @param {UserDTO} userDTO - The updated user data.
 * @returns {Promise<UserDTO>} A promise that resolves with the updated user's data.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function updateUser(id: string, userDTO: UserDTO) {
    try {
        const response = await api.put(`${USER_API}/${id}`, userDTO);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al actualizar usuario");
    }
}

/**
 * Deletes a user by their unique user ID.
 * @param {string} id - The unique identifier of the user to delete.
 * @returns {Promise<any>} A promise that resolves with the result of the deletion.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export async function deleteUser(id: string) {
    try {
        const response = await api.delete(`${USER_API}/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al eliminar usuario");
    }
}