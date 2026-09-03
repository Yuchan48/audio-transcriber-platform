// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAudioFiles: vi.fn(),
  fetchAudioFile: vi.fn(),
  fetchAudioTranscript: vi.fn(),
}));

let wsData: {
  audio_id: number;
  status: string;
  transcript?: string;
} | null = null;

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
    data: wsData,
    status: "connected",
  }),
}));

vi.mock("../../src/services/audioService", () => ({
  getAudioFiles: mocks.getAudioFiles,
  uploadAudioFile: vi.fn(),
  deleteAudioFile: vi.fn(),
  fetchAudioFile: mocks.fetchAudioFile,
  fetchAudioTranscript: mocks.fetchAudioTranscript,
  fetchAllAudioFiles: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("../../src/components/audio/RecordAudio", () => ({
  default: () => <div>Record Audio</div>,
}));

import UserDashboard from "../../src/pages/dashboard/UserDashboard";

afterEach(() => {
  wsData = null;
  vi.clearAllMocks();
});

describe("UserDashboard transcription flow", () => {
  it("updates an audio file when a transcription update is received", async () => {
    mocks.getAudioFiles.mockResolvedValueOnce([
      {
        id: 7,
        filename: "meeting-notes.mp3",
        status: "processing",
        transcription: null,
      },
    ]);

    const { rerender } = render(<UserDashboard />);

    // Initial audio file is displayed.
    expect(await screen.findByText("meeting-notes.mp3")).toBeTruthy();

    expect(screen.getByText(/processing/i)).toBeTruthy();

    // Simulate a WebSocket update from the backend.
    wsData = {
      audio_id: 7,
      status: "completed",
      transcript: "This is the completed transcription.",
    };

    // Trigger UserDashboard to receive the new WebSocket data.
    rerender(<UserDashboard />);

    // The audio status should now be updated.
    await waitFor(() => {
      expect(screen.getByText(/completed/i)).toBeTruthy();
    });

    // Mock the API calls made when expanding the completed audio.
    mocks.fetchAudioFile.mockResolvedValueOnce(
      new Blob(["audio data"], {
        type: "audio/mpeg",
      }),
    );

    mocks.fetchAudioTranscript.mockResolvedValueOnce({
      transcription: "This is the completed transcription.",
    });

    // Expand the completed audio.
    screen.getByText("meeting-notes.mp3").click();

    // The transcript should be displayed.
    expect(
      await screen.findByText("This is the completed transcription."),
    ).toBeTruthy();

    expect(mocks.fetchAudioFile).toHaveBeenCalledWith(7);
    expect(mocks.fetchAudioTranscript).toHaveBeenCalledWith(7);
  });
});
