// API Base URL - Use environment variable or fallback to localhost
export const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`;

// Debug log for development
if (import.meta.env.DEV) {
  console.log("🔗 API Base URL:", BASE_URL);
}
