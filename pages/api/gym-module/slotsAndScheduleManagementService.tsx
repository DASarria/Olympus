import api from "@/pages/api/axiosInstance";
const USER_API = "/users";

/**
 * Fetches the list of students registered for a particular session.
 * @param {string} sessionId - The unique identifier for the training session.
 * @returns {Promise<Array<Record<string, any>>>} A promise that resolves with an array of student records.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export const getRegisteredStudents = async (sessionId: string) => {
  try {
    const response = await api.get(`${USER_API}/trainer/sessions/${sessionId}/students`);
    return response.data as Array<Record<string, any>>;
  } catch (error: any) {
     throw new Error(error.response?.data?.error || 'Error fetching registered students:', error);
  }
};

/**
 * Records attendance for a student in a session.
 * @param {Object} attendanceData - The data containing attendance information.
 * @param {string} attendanceData.userId - The unique identifier for the student.
 * @param {string} attendanceData.reservationId - The unique identifier for the student's reservation.
 * @param {string} [attendanceData.attendanceTime] - The time when the student attended the session (optional).
 * @returns {Promise<{ success: boolean; message: string }>} A promise that resolves with the success status and a message.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export const recordStudentAttendance = async (attendanceData: {
  userId: string;
  reservationId: string;
  attendanceTime?: string;
}) => {
  try {
    const response = await api.post(`${USER_API}/trainer/attendance`, attendanceData);
    return response.data as { success: boolean; message: string };
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error recording attendance:', error);
  }
};

/**
 * Fetches attendance statistics for a trainer within a specified date range.
 * @param {string} trainerId - The unique identifier for the trainer.
 * @param {string} startDate - The start date of the range for fetching attendance statistics (format: YYYY-MM-DD).
 * @param {string} endDate - The end date of the range for fetching attendance statistics (format: YYYY-MM-DD).
 * @returns {Promise<Record<string, any>>} A promise that resolves with the attendance statistics.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export const getAttendanceStatistics = async (
  trainerId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await api.get(`${USER_API}/trainer/${trainerId}/attendance/stats`, {
      params: { startDate, endDate },
    });
    return response.data as Record<string, any>;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching attendance statistics:', error);
  }
};

/**
 * Fetches details of a session by its unique session ID.
 * @param {string} sessionId - The unique identifier for the session.
 * @returns {Promise<any>} A promise that resolves with the session details.
 * @throws {Error} Throws an error if the API request fails or if an error message is provided by the API.
 */
export const getSessionById = async (sessionId: string) => {
  try {
    const response = await api.get(`${USER_API}/gym/sessions/${sessionId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching session by ID:', error);
  }
};
