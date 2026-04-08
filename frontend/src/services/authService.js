import { apiFetch } from "./apiFetch";

// For development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For production
// const API_BASE_URL = "/api";

export async function login(email, password) {
  // Call the login API with the provided email and password
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // Parse the response JSON and check for errors
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
}

export function logout() {
  return fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

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

export async function fetchCurrentUser() {
  await apiFetch("/auth/me");
}
