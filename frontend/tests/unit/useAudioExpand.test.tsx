import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";

import { useAudioExpand } from "../../src/hooks/useAudioExpand";
import {
  fetchAudioFile,
  fetchAudioTranscript,
} from "../../src/services/audioService";

import type { AudioFile } from "../../src/types";

vi.mock("../../src/services/audioService", () => ({
  fetchAudioFile: vi.fn(),
  fetchAudioTranscript: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("useAudioExpand", () => {
  it("does not expand when audio is not completed", async () => {
    const audioFile = {
      id: 1,
      filename: "audio.mp3",
      status: "processing",
    } as AudioFile;

    const { result } = renderHook(() => useAudioExpand(audioFile));

    await act(async () => {
      await result.current.toggleExpand();
    });

    expect(result.current.open).toBe(false);
    expect(fetchAudioFile).not.toHaveBeenCalled();
    expect(fetchAudioTranscript).not.toHaveBeenCalled();
  });

  it("fetches audio and transcript when expanding a completed file", async () => {
    const audioFile = {
      id: 1,
      filename: "audio.mp3",
      status: "completed",
    } as AudioFile;

    const blob = new Blob(["audio"]);

    vi.mocked(fetchAudioFile).mockResolvedValueOnce(blob);
    vi.mocked(fetchAudioTranscript).mockResolvedValueOnce({
      transcription: "Hello world",
    });

    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test-url");

    const { result } = renderHook(() => useAudioExpand(audioFile));

    await act(async () => {
      await result.current.toggleExpand();
    });

    await waitFor(() => {
      expect(result.current.open).toBe(true);
      expect(result.current.audioUrl).toBe("blob:test-url");
      expect(result.current.transcript).toBe("Hello world");
      expect(result.current.loading).toBe(false);
    });

    expect(fetchAudioFile).toHaveBeenCalledWith(1);
    expect(fetchAudioTranscript).toHaveBeenCalledWith(1);
    expect(createObjectURL).toHaveBeenCalledWith(blob);
  });
});
