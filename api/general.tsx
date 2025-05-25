import { jwtDecode } from 'jwt-decode';

/**
 * Decodes the JWT token and extracts the user's `id` from the token payload.
 * 
 * This function retrieves the JWT token stored in `localStorage`, decodes it using the `jwt-decode` library, 
 * and returns the `id` of the user stored in the token's payload. If the token is missing, invalid, or 
 * if there is an error during decoding, the function will return `null`.
 * 
 * @returns {string | null} The user's `id` if found in the token, or `null` if the token is not available 
 * or if decoding fails.
 * 
 * @throws {Error} Throws an error if the token format is invalid or there is an issue decoding the token.
 */
export function getUserIdFromToken(): string | null {
  try {
    const token = sessionStorage.getItem('token');
    
    // If no token is found, log an error and return null
    if (!token) {
      console.error("Token not found");
      return null;
    }

    // Decode the token to get the payload
    const decodedToken = jwtDecode<{ id: string, userName: string, email: string, name: string, role: string, specialty: string | null, exp: number }>(token);
    
    // Return the user's id if present in the token
    return decodedToken.id || null;
  } catch (error) {
    console.error("Error decoding the token:", error);
    return null;
  }
}
