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

const UserDashboard = () => {
  const { user } = useAuth();
  const [audioLoading, setAudioLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [audioFiles, setAudioFiles] = useState([]);

  const wsUpdate = useWebSocket();

  // fetch files
  const fetchAudioFiles = async () => {
    try {
      setAudioLoading(true);
      const data = await getAudioFiles();
      setAudioFiles(data);
    } catch (error) {
      setError("Error fetching audio files: " + error.message);
    } finally {
      setAudioLoading(false);
    }
  };

  // fetch audio files on mount
  useEffect(() => {
    fetchAudioFiles();
  }, []);

  // delete audio file
  const handleDeleteAudio = async (audioFile) => {
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
    } catch (error) {
      setError("Error deleting audio file: " + error.message);
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
              transcript: wsUpdate.transcript || file.transcription,
            }
          : file,
      ),
    );
  }, [wsUpdate]);

  // upload audio file
  const handleUploadAudio = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      await uploadAudioFile(file);

      toast.success(`Audio file "${file.name}" uploaded successfully`);
      // Refresh audio list after successful upload
      fetchAudioFiles();
    } catch (error) {
      setError("Error uploading audio file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Display message for demo user */}
      {user?.email === import.meta.env.VITE_DEMO_EMAIL && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm">
          ⚠️ You are using a demo account. All uploaded audio will be deleted
          when you log out.
        </div>
      )}

      {/* Upload */}
      <UploadBox
        uploading={uploading}
        setUploading={setUploading}
        error={error}
        setError={setError}
        fetchAudioFiles={fetchAudioFiles}
        handleUploadAudio={handleUploadAudio}
      />

      {/* Record Audio */}
      <RecordAudio onUploadSuccess={fetchAudioFiles} setError={setError} />

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
