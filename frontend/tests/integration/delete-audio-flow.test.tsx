// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAudioFiles: vi.fn(),
  deleteAudioFile: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "user@example.com",
    },
  }),
}));

vi.mock("../../src/hooks/useWebSocket", () => ({
  default: () => ({
    data: null,
    status: "connected",
  }),
}));

vi.mock("../../src/services/audioService", () => ({
  getAudioFiles: mocks.getAudioFiles,
  deleteAudioFile: mocks.deleteAudioFile,
  uploadAudioFile: vi.fn(),
  fetchAudioFile: vi.fn(),
  fetchAudioTranscript: vi.fn(),
  fetchAllAudioFiles: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: mocks.toastSuccess,
  },
}));

vi.mock("../../src/components/audio/RecordAudio", () => ({
  default: () => <div>Record Audio</div>,
}));

import UserDashboard from "../../src/pages/dashboard/UserDashboard";

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("UserDashboard delete flow", () => {
  it("deletes an audio file and removes it from the list", async () => {
    const audioFile = {
      id: 7,
      filename: "meeting-notes.mp3",
      status: "completed",
      transcription: "Test transcript",
    };

    mocks.getAudioFiles.mockResolvedValueOnce([audioFile]);
    mocks.deleteAudioFile.mockResolvedValueOnce(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<UserDashboard />);

    // Wait for the audio file to appear.
    expect(await screen.findByText("meeting-notes.mp3")).toBeTruthy();

    // Click the Delete button.
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Confirm that the deletion was requested.
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete the audio file "meeting-notes.mp3"?',
    );

    expect(mocks.deleteAudioFile).toHaveBeenCalledWith(7);

    // The file should be removed from the list.
    await waitFor(() => {
      expect(screen.queryByText("meeting-notes.mp3")).not.toBeInTheDocument();
    });

    // Success notification should be displayed.
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      'Audio file "meeting-notes.mp3" deleted successfully',
    );
  });
});
