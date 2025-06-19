import { appState } from "../config.js";
export function getUserIdFromToken() {
  try {
    if (!appState.token) return null;

    // JWT tokens have 3 parts separated by dots
    const parts = appState.token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    console.log("JWT Payload:", payload);

    // Look for user ID in common fields
    return payload.sub || payload.userId || payload.id || payload.user_id;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
