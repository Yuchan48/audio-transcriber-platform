import { apiFetch } from "./apiFetch";

// get audio files for the user
export async function getAudioFiles() {
  const response = await apiFetch("/audio");
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

  const response = await apiFetch("/audio/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload audio file");
  }
  return response.json();
}

export async function deleteAudioFile(id) {
  const response = await apiFetch(`/audio/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete audio file");
  }
  return response.json();
}

export async function fetchAllAudioFiles() {
  const response = await apiFetch("/admin/audio");
  if (!response.ok) {
    throw new Error("Failed to fetch audio files");
  }
  return response.json();
}
