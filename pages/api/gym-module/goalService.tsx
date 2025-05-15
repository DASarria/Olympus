import api from "@/pages/api/axiosInstance";
const USER_API = "/users";


/**
 * Fetches the goals of a specific user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<any[]>} A promise that resolves with the user's goals.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getUserGoals(userId: string) {
    try {
        const response = await api.get(`${USER_API}/${userId}/goals`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al obtener metas");
    }
}

/**
 * Creates new goals for a specific user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string[]} goals - An array of goals to be created for the user.
 * @returns {Promise<any[]>} A promise that resolves with the created goals.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function createUserGoals(userId: string, goals: string[]) {
    try {
        const response = await api.post(`${USER_API}/${userId}/goals`, goals);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al crear metas");
    }
}

/**
 * Updates a specific goal for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} goalId - The unique identifier of the goal to update.
 * @param {any} goal - The updated goal object.
 * @returns {Promise<any>} A promise that resolves with the updated goal.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updateUserGoal(userId: string, goalId: string, goal: any) {
    try {
        const response = await api.put(`${USER_API}/${userId}/goals/${goalId}`, goal);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al actualizar la meta");
    }
}

/**
 * Deletes a specific goal for a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} goalId - The unique identifier of the goal to delete.
 * @returns {Promise<any>} A promise that resolves with the response data.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function deleteUserGoal(userId: string, goalId: string) {
    try {
        const response = await api.delete(`${USER_API}/${userId}/goals/${goalId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error al eliminar la meta");
    }
}