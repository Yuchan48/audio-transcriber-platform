import { useState, useEffect } from "react";

import { fetchAudioFile, fetchAudioTranscript } from "../services/audioService";

// import types
import type { AudioFile } from "../types";

export function useAudioExpand(audioFile: AudioFile) {
  const [open, setOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchAudioError, setFetchAudioError] = useState<string>("");

  const toggleExpand = async () => {
    // open only when the status is completed
    if (audioFile.status !== "completed") return;

    const next = !open;
    setOpen(next);

    if (next && !audioUrl) {
      try {
        setLoading(true);
        setFetchAudioError("");

        // load audio file
        const blob = await fetchAudioFile(audioFile.id);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // load transcript
        const transcriptData = await fetchAudioTranscript(audioFile.id);
        setTranscript(transcriptData.transcription);
      } catch (err) {
        if (err instanceof Error) {
          setFetchAudioError("Error loading audio details: " + err.message);
        } else {
          setFetchAudioError(
            "An unknown error occurred while loading audio details.",
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // revoke object URL on unmount or when audioFile changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return { open, toggleExpand, audioUrl, transcript, loading, fetchAudioError };
}
