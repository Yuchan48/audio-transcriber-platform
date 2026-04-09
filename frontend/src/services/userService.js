import { apiFetch } from "./apiFetch";

export async function fetchCurrentUser() {
  const response = await apiFetch("/auth/me");
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
}

export async function fetchAllUsers() {
  const response = await apiFetch("/admin/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}
