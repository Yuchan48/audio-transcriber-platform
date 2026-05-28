// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAudioFiles: vi.fn(),
  uploadAudioFile: vi.fn(),
  toastSuccess: vi.fn(),
}));

// Mock the useAuth hook to simulate an authenticated user context
vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, email: "user@example.com" },
  }),
}));

// Mock the useWebSocket hook to prevent actual WebSocket connections during tests
vi.mock("../src/hooks/useWebSocket", () => ({
  default: () => ({ data: null, status: "connected" }),
}));

// Mock the react-hot-toast library to prevent actual toast notifications during tests
vi.mock("react-hot-toast", () => ({
  toast: {
    success: mocks.toastSuccess,
  },
}));

// Mock the audioService to control API interactions during tests
vi.mock("../src/services/audioService", () => ({
  getAudioFiles: mocks.getAudioFiles,
  uploadAudioFile: mocks.uploadAudioFile,
  deleteAudioFile: vi.fn(),
  fetchAudioFile: vi.fn(),
  fetchAudioTranscript: vi.fn(),
  fetchAllAudioFiles: vi.fn(),
}));

import UserDashboard from "../src/pages/dashboard/UserDashboard";

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

describe("UserDashboard upload flow", () => {
  // test uploading a file and refreshing the audio list
  it("uploads a selected file and refreshes the visible list", async () => {
    let resolveUpload: () => void;

    mocks.getAudioFiles.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: 7,
        filename: "meeting-notes.mp3",
        status: "completed",
        transcription: "Uploaded transcript",
      },
    ]);

    // Mock uploadAudioFile to return a promise
    mocks.uploadAudioFile.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveUpload = resolve;
        }),
    );

    render(<UserDashboard />);

    // Wait for the initial state where no audio files are present
    expect(
      await screen.findByText(/no audio files uploaded yet/i),
    ).toBeTruthy();

    const file = new File(["audio bytes"], "meeting-notes.mp3", {
      type: "audio/mpeg",
    });
    // Simulate selecting a file for upload
    fireEvent.change(screen.getByLabelText(/choose file/i), {
      target: { files: [file] },
    });

    // Assert that the uploadAudioFile function was called with the selected file
    expect(mocks.uploadAudioFile).toHaveBeenCalledWith(file);
    // Assert that the UI shows an uploading state
    expect(screen.getByText(/uploading/i)).toBeTruthy();

    // Resolve the upload promise to simulate a successful upload completion
    resolveUpload!();

    // Wait for the UI to refresh and show the newly uploaded file
    await waitFor(() =>
      expect(screen.getByText(/meeting-notes\.mp3/i)).toBeTruthy(),
    );
  });

  // test handling of upload failures and displaying an error message
  it("surfaces upload failures as an error banner", async () => {
    mocks.getAudioFiles.mockResolvedValueOnce([]);
    mocks.uploadAudioFile.mockRejectedValueOnce(new Error("Upload failed"));

    render(<UserDashboard />);

    // Wait for the initial state where no audio files are present
    expect(
      await screen.findByText(/no audio files uploaded yet/i),
    ).toBeTruthy();

    const file = new File(["audio bytes"], "broken.mp3", {
      type: "audio/mpeg",
    });
    // Simulate selecting a file for upload
    fireEvent.change(screen.getByLabelText(/choose file/i), {
      target: { files: [file] },
    });

    // Assert that the uploadAudioFile function was called with the selected file
    expect(mocks.uploadAudioFile).toHaveBeenCalledWith(file);
    // Wait for the UI to show the error message related to the upload failure
    expect(
      await screen.findByText(/error uploading audio file: upload failed/i),
    ).toBeTruthy();
  });
});
