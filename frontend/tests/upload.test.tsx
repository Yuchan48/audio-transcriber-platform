// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAudioFiles: vi.fn(),
  uploadAudioFile: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, email: "user@example.com" },
  }),
}));

vi.mock("../src/hooks/useWebSocket", () => ({
  default: () => ({ data: null, status: "connected" }),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: mocks.toastSuccess,
  },
}));

vi.mock("../src/services/audioService", () => ({
  getAudioFiles: mocks.getAudioFiles,
  uploadAudioFile: mocks.uploadAudioFile,
  deleteAudioFile: vi.fn(),
  fetchAudioFile: vi.fn(),
  fetchAudioTranscript: vi.fn(),
  fetchAllAudioFiles: vi.fn(),
}));

import UserDashboard from "../src/pages/dashboard/UserDashboard";

afterEach(() => {
  vi.clearAllMocks();
});

describe("UserDashboard upload flow", () => {
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

    mocks.uploadAudioFile.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveUpload = resolve;
        }),
    );

    render(<UserDashboard />);

    expect(
      await screen.findByText(/no audio files uploaded yet/i),
    ).toBeTruthy();

    const file = new File(["audio bytes"], "meeting-notes.mp3", {
      type: "audio/mpeg",
    });
    fireEvent.change(screen.getByLabelText(/choose file/i), {
      target: { files: [file] },
    });

    expect(mocks.uploadAudioFile).toHaveBeenCalledWith(file);
    expect(screen.getByText(/uploading/i)).toBeTruthy();

    resolveUpload!();

    await waitFor(() =>
      expect(screen.getByText(/meeting-notes\.mp3/i)).toBeTruthy(),
    );
  });

  it("surfaces upload failures as an error banner", async () => {
    mocks.getAudioFiles.mockResolvedValueOnce([]);
    mocks.uploadAudioFile.mockRejectedValueOnce(new Error("Upload failed"));

    render(<UserDashboard />);

    expect(
      await screen.findByText(/no audio files uploaded yet/i),
    ).toBeTruthy();

    const file = new File(["audio bytes"], "broken.mp3", {
      type: "audio/mpeg",
    });
    fireEvent.change(screen.getByLabelText(/choose file/i), {
      target: { files: [file] },
    });

    expect(mocks.uploadAudioFile).toHaveBeenCalledWith(file);
    expect(
      await screen.findByText(/error uploading audio file: upload failed/i),
    ).toBeTruthy();
  });
});
