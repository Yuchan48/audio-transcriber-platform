import { apiFetch } from "./apiFetch";

const prefix = "/audio";

// get audio files for the current user
export async function getAudioFiles() {
  const response = await apiFetch(`${prefix}`);
  if (!response.ok) {
    throw new Error("Failed to fetch audio files");
  }
  return response.json();
}

// upload audio file
export async function uploadAudioFile(file) {
  // Create FormData and append the file
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch(`${prefix}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload audio file");
  }
  return response.json();
}

// delete audio file by id
export async function deleteAudioFile(id) {
  const response = await apiFetch(`${prefix}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete audio file");
  }
  return response.json();
}

// get all audio files (admin only)
export async function fetchAllAudioFiles() {
  const response = await apiFetch(`${prefix}/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch audio files");
  }
  return response.json();
}
