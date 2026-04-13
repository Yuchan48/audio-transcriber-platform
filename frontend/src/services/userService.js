import { apiFetch } from "./apiFetch";

const prefix = "/user";

// get current user info
export async function fetchCurrentUser() {
  const response = await apiFetch(`${prefix}/me`);
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
}

// delete user account - admin can delete any account except themselves, user can delete their own account
export async function deleteUserAccount(userId) {
  // For admin, add userId query param to specify which user to delete. If not provided, it will delete the current user's account
  const url = userId ? `${prefix}?user_id=${userId}` : `${prefix}`;
  const response = await apiFetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete user account");
  }
  return response.json();
}

// get all users (admin only)
export async function fetchAllUsers() {
  const response = await apiFetch(`${prefix}/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}
