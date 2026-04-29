import { apiFetch } from "./apiFetch";

const prefix = "/auth";

// login user
export async function login(email: string, password: string) {
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
export async function register(email: string, password: string) {
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
