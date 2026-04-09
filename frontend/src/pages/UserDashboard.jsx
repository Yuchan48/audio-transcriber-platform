import { useState, useEffect } from "react";
import useWebSocket from "../hooks/useWebSocket";

// import functions
import {
  getAudioFiles,
  uploadAudioFile,
  deleteAudioFile,
} from "../services/audioService";

// import UI components
import AudioList from "../components/audio/AudioList";

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

  // upload audio file
  const handleUploadAudio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      await uploadAudioFile(file);
      fetchAudioFiles(); // refresh list after upload
    } catch (error) {
      setError("Error uploading audio file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Upload */}
      <div className="mb-4">
        <input type="file" onChange={handleUploadAudio} />

        {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {audioLoading ? (
        <p>Loading...</p>
      ) : (
        <AudioList files={audioFiles} onDelete={handleDeleteAudio} />
      )}
    </div>
  );
};

export default UserDashboard;
