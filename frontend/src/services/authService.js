import { apiFetch } from "./apiFetch";

// For development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For production
// const API_BASE_URL = "/api";

const prefix = "/auth";

// login user
export async function login(email, password) {
  // Call the login API with the provided email and password
  const response = await apiFetch(`${prefix}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // Parse the response JSON and check for errors
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data;
}

// logout user
export function logout() {
  return apiFetch(`${prefix}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

// register new user
export async function register(email, password) {
  const response = await apiFetch(`${prefix}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
}
