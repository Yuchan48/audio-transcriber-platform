import { useState, useEffect } from "react";
import useWebSocket from "../hooks/useWebSocket";

// import functions
import {
  getAudioFiles,
  deleteAudioFile,
  uploadAudioFile,
} from "../services/audioService";

// import UI components
import AudioList from "../components/audio/AudioList";
import UploadBox from "../components/audio/UploadBox";

const UserDashboard = () => {
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
  const handleDeleteAudio = async (id) => {
    try {
      await deleteAudioFile(id);
      setAudioFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (error) {
      setError("Error deleting audio file: " + error.message);
    }
  };

  // websocket for real-time updates
  useEffect(() => {
    if (!wsUpdate) return;

    setAudioFiles((prev) =>
      prev.map((file) =>
        file.id === wsUpdate.id ? { ...file, status: wsUpdate.status } : file,
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
      <h1 className="text-2xl font-semibold">My Dashboard</h1>

      {/* Upload */}
      <UploadBox
        uploading={uploading}
        setUploading={setUploading}
        error={error}
        setError={setError}
        fetchAudioFiles={fetchAudioFiles}
        handleUploadAudio={handleUploadAudio}
      />

      {/* Audio list */}
      <div>
        {audioLoading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <AudioList audioFiles={audioFiles} onDelete={handleDeleteAudio} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
