import { useState } from "react";

import { fetchAudioFile, fetchAudioTranscript } from "../services/audioService";

export function useAudioExpand(audioFile) {
  const [open, setOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleExpand = async () => {
    // open only when the status is completed
    if (audioFile.status !== "completed") return;

    const next = !open;
    setOpen(next);

    if (next && !audioUrl) {
      try {
        setLoading(true);
        setError("");

        // load audio file
        const blob = await fetchAudioFile(audioFile.id);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // load transcript
        const transcriptData = await fetchAudioTranscript(audioFile.id);
        setTranscript(transcriptData.transcription);
      } catch (error) {
        setError("Error loading audio details: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return { open, toggleExpand, audioUrl, transcript, loading, error };
}
