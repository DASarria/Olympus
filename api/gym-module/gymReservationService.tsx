import api from "@/api/axiosInstance";
const USER_API = "/users";

/**
 * @enum {string} ReservationStatus
 * @description The status of a reservation.
 * @property {string} PENDING - The reservation is pending and has not been confirmed yet.
 * @property {string} CONFIRMED - The reservation has been confirmed.
 * @property {string} COMPLETED - The reservation has been completed.
 * @property {string} CANCELLED - The reservation has been cancelled.
 * @property {string} MISSED - The user missed the reservation.
 * @property {string} CHECKED_IN - The user has checked into the session.
 */
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED',
  CHECKED_IN = 'CHECKED_IN',
}

/**
 * @typedef {Object} ReservationDTO
 * @property {string} userId - The unique identifier of the user who made the reservation.
 * @property {string} sessionId - The unique identifier of the session the reservation is for.
 * @property {ReservationStatus} status - The status of the reservation, defined by the `ReservationStatus` enum.
 * @property {string} reservationDate - The date the reservation was made.
 * @property {string} [cancellationDate] - The date the reservation was cancelled, if applicable (optional).
 * @property {string} [checkInTime] - The time the user checked into the session, if applicable (optional).
 * @property {string[]} equipmentIds - The list of equipment IDs reserved for the session.
 * @property {string} [notes] - Any additional notes related to the reservation (optional).
 */
export interface ReservationDTO {
  userId?: string;
  sessionId?: string;
  notes?: string;
}

export interface Reservation {
    id: string;
    userId: string;
    sessionId: string;
    status: ReservationStatus;
    notes?:string;
}

/**
 * Fetches the gym availability for a given date.
 * @param {string} date - The date for which to fetch the gym availability.
 * @returns {Promise<Array<any>>} A promise that resolves with the gym availability data.
 * @throws {Error} Throws an error if the gym availability cannot be fetched.
 */
export async function getGymAvailability(date: string): Promise<Array<any>> {
  try {
    const response = await api.get<Array<any>>(`${USER_API}/gym/availability`, { params: { date } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener disponibilidad del gimnasio");
  }
}

/**
 * Checks availability for a specific time on a given date.
 * @param {string} date - The date to check for availability.
 * @param {string} time - The time to check for availability.
 * @returns {Promise<Record<string, any>>} A promise that resolves with the availability status.
 * @throws {Error} Throws an error if the availability cannot be checked for the specified time.
 */
export async function checkAvailabilityForTime(date: string, time: string): Promise<Record<string, any>> {
  try {
    const response = await api.get<Record<string, any>>(`${USER_API}/gym/availability/time`, { params: { date, time } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al verificar disponibilidad para la hora especificada");
  }
}


/**
 * Creates a reservation for a user.
 * @param {string} userId - The unique identifier of the user making the reservation.
 * @param {ReservationDTO} reservationDTO - The reservation details to be created.
 * @returns {Promise<Record<string, any>>} A promise that resolves with the created reservation data.
 * @throws {Error} Throws an error if the reservation cannot be created.
 */
export async function createReservation(userId: string, reservationDTO: ReservationDTO): Promise<Record<string, any>> {
  try {
    const response = await api.post<Record<string, any>>(`${USER_API}/${userId}/reservations`, reservationDTO);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear la reserva");
  }
}

/**
 * Fetches all reservations made by a user.
 * @param {string} userId - The unique identifier of the user whose reservations are to be fetched.
 * @returns {Promise<Reservation[]>} A promise that resolves with an array of reservation data.
 * @throws {Error} Throws an error if the user's reservations cannot be fetched.
 */
export async function getUserReservations(userId: string): Promise<Reservation[]> {
  try {
    const response = await api.get<Reservation[]>(`${USER_API}/${userId}/reservations`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener las reservas del usuario");
  }
}

/**
 * Fetches details of a specific reservation made by a user.
 * @param {string} userId - The unique identifier of the user whose reservation details are to be fetched.
 * @param {string} reservationId - The unique identifier of the reservation to fetch.
 * @returns {Promise<Reservation>} A promise that resolves with the reservation details.
 * @throws {Error} Throws an error if the reservation details cannot be fetched.
 */
export async function getReservationDetails(userId: string, reservationId: string): Promise<Reservation> {
  try {
    const response = await api.get<Reservation>(`${USER_API}/${userId}/reservations/${reservationId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener los detalles de la reserva");
  }
}

/**
 * Cancels a reservation made by a user.
 * @param {string} userId - The unique identifier of the user whose reservation is to be canceled.
 * @param {string} reservationId - The unique identifier of the reservation to cancel.
 * @returns {Promise<Record<string, string>>} A promise that resolves with the cancellation confirmation.
 * @throws {Error} Throws an error if the reservation cannot be canceled.
 */
export async function cancelReservation(userId: string, reservationId: string): Promise<Record<string, string>> {
  try {
    const response = await api.delete<Record<string, string>>(`${USER_API}/${userId}/reservations/${reservationId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al cancelar la reserva");
  }
}


/**
 * Adds a user to the waitlist for a specific session.
 * @param {string} userId - The unique identifier of the user to add to the waitlist.
 * @param {string} sessionId - The unique identifier of the session to join the waitlist for.
 * @returns {Promise<Record<string, any>>} A promise that resolves with the waitlist confirmation data.
 * @throws {Error} Throws an error if the user cannot be added to the waitlist.
 */
export async function joinWaitlist(userId: string, sessionId: string): Promise<Record<string, any>> {
  try {
    const response = await api.post<Record<string, any>>(`${USER_API}/${userId}/sessions/${sessionId}/waitlist`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al unirse a la lista de espera");
  }
}

/**
 * Fetches the waitlist status for a user for a specific session.
 * @param {string} userId - The unique identifier of the user whose waitlist status is to be fetched.
 * @param {string} sessionId - The unique identifier of the session to fetch the waitlist status for.
 * @returns {Promise<Record<string, any>>} A promise that resolves with the waitlist status data.
 * @throws {Error} Throws an error if the waitlist status cannot be fetched.
 */
export async function getWaitlistStatus(userId: string, sessionId: string): Promise<Record<string, any>> {
  try {
    const response = await api.get<Record<string, any>>(`${USER_API}/${userId}/sessions/${sessionId}/waitlist`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener el estado de la lista de espera");
  }
}


/**
 * Fetches all waitlists for a specific user.
 * @param {string} userId - The unique identifier of the user whose waitlists are to be fetched.
 * @returns {Promise<Array<Record<string, any>>>} A promise that resolves with an array of waitlist data.
 * @throws {Error} Throws an error if the user's waitlists cannot be fetched.
 */
export async function getUserWaitlists(userId: string): Promise<Array<Record<string, any>>> {
  try {
    const response = await api.get<Array<Record<string, any>>>(`${USER_API}/${userId}/waitlists`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener las listas de espera del usuario");
  }
}

/**
 * Removes a user from the waitlist for a specific session.
 * @param {string} userId - The unique identifier of the user to remove from the waitlist.
 * @param {string} sessionId - The unique identifier of the session to remove the user from the waitlist.
 * @returns {Promise<Record<string, string>>} A promise that resolves with the removal confirmation.
 * @throws {Error} Throws an error if the user cannot be removed from the waitlist.
 */
export async function leaveWaitlist(userId: string, sessionId: string): Promise<Record<string, string>> {
  try {
    const response = await api.delete<Record<string, string>>(`${USER_API}/${userId}/sessions/${sessionId}/waitlist`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al salir de la lista de espera");
  }
}