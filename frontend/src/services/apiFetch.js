// For development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For production
// const API_BASE_URL = "/api";

export async function apiFetch(path, options = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });
}
