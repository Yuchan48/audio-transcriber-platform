import { useState, useEffect } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import { useAuth } from "../../context/AuthContext";

import { toast } from "react-hot-toast";

// import functions
import {
  getAudioFiles,
  deleteAudioFile,
  uploadAudioFile,
} from "../../services/audioService";

// import UI components
import RecordAudio from "../../components/audio/RecordAudio";
import AudioList from "../../components/audio/AudioList";
import UploadBox from "../../components/audio/UploadBox";
import Spinner from "../../components/icons/Spinner";

// import types
import type { AudioFile } from "../../types";

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL || "demo@example.com";

const UserDashboard = () => {
  const { user } = useAuth();
  const [audioLoading, setAudioLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  const { data: wsUpdate, status } = useWebSocket(!!user);

  // fetch files
  const fetchAudioFiles = async () => {
    try {
      setAudioLoading(true);
      const data = await getAudioFiles();
      setAudioFiles(data);
    } catch (err) {
      if (err instanceof Error) {
        setError("Error fetching audio files: " + err.message);
      } else {
        setError("An unknown error occurred while fetching audio files.");
      }
    } finally {
      setAudioLoading(false);
    }
  };

  // fetch audio files on mount
  useEffect(() => {
    fetchAudioFiles();
  }, []);

  // delete audio file
  const handleDeleteAudio = async (audioFile: AudioFile) => {
    setError("");
    // ask if the user is sure
    if (
      !window.confirm(
        `Are you sure you want to delete the audio file "${audioFile.filename}"?`,
      )
    ) {
      return;
    }
    try {
      await deleteAudioFile(audioFile.id);

      setAudioFiles((prev) => prev.filter((file) => file.id !== audioFile.id));
      toast.success(`Audio file "${audioFile.filename}" deleted successfully`);
    } catch (err) {
      if (err instanceof Error) {
        setError("Error deleting audio file: " + err.message);
      } else {
        setError("An unknown error occurred while deleting the audio file.");
      }
    }
  };

  // websocket for real-time updates
  useEffect(() => {
    if (!wsUpdate) return;

    setAudioFiles((prev) =>
      prev.map((file) =>
        file.id === wsUpdate.audio_id
          ? {
              ...file,
              status: wsUpdate.status,
              transcript: wsUpdate.transcript ?? file.transcription,
            }
          : file,
      ),
    );
  }, [wsUpdate]);

  // websocket connection status effect
  useEffect(() => {
    if (status === "disconnected") {
      console.warn("WebSocket disconnected, trying to reconnect...");
    }
  }, [status]);

  // upload audio file
  const handleUploadAudio = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      await uploadAudioFile(file);

      toast.success(`Audio file "${file.name}" uploaded successfully`);
      // Refresh audio list after successful upload
      // fetchAudioFiles();
    } catch (err) {
      if (err instanceof Error) {
        setError("Error uploading audio file: " + err.message);
      } else {
        setError("An unknown error occurred while uploading the audio file.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Display message for demo user */}
      {user?.email === DEMO_EMAIL && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm">
          ⚠️ You are using a demo account. All uploaded audio will be deleted
          when you log out.
        </div>
      )}

      {/* Display message if audio limit is reached */}
      {!audioLoading && audioFiles.length >= 20 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          ⚠️ You have reached the maximum limit of 20 audio files. Please delete
          some files to upload new ones.
        </div>
      )}

      {status !== "connected" && (
        <div className="text-xs text-yellow-600">
          {status === "connecting" ? "Connecting..." : "Reconnecting..."}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Upload */}
      <UploadBox
        uploading={uploading}
        setError={setError}
        handleUploadAudio={handleUploadAudio}
        onUploadSuccess={fetchAudioFiles}
        disabled={!audioLoading && audioFiles.length >= 20} // Disable if there are already 20 audio files
      />

      {/* Record Audio */}
      <RecordAudio
        onUploadSuccess={fetchAudioFiles}
        setError={setError}
        disabled={!audioLoading && audioFiles.length >= 20}
      />

      {/* Audio list */}
      <div>
        {audioLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 pt-10">
            <Spinner className="h-6 w-6 mb-2" />
            <p className="text-sm">Loading audio files...</p>
          </div>
        ) : (
          <AudioList audioFiles={audioFiles} onDelete={handleDeleteAudio} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
