import { apiFetch } from "./apiFetch";
import { type CredentialResponse } from "@react-oauth/google";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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

export async function loginWithGoogle(credentialResponse: CredentialResponse) {
  // Ensure we received a credential from Google
  if (!credentialResponse.credential) {
    throw new Error("No Google credential received");
  }

  // Send the Google token to the backend for verification and user creation/login
  const response = await fetch(`${API_BASE_URL}${prefix}/google`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ credential: credentialResponse.credential }),
  });

  // Check if the response is successful
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Google login failed");
  }

  // Parse the user data from the response and return it
  return response.json();
}
