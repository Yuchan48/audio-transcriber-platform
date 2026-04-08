import { apiFetch } from "./apiFetch";

// For development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For production
// const API_BASE_URL = "/api";

export async function register(email, password) {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
}
