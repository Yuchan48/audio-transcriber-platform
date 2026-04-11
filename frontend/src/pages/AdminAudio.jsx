import { useState, useEffect } from "react";

// import functions
import { fetchAllAudioFiles } from "../services/audioService";
import { deleteAudioFile } from "../services/audioService";

// import UI components
import AdminAudioItem from "../components/audio/AdminAudioItem";
import StatusBadge from "../components/icons/StatusBadge";
import DeleteButton from "../components/buttons/DeleteButton";

const AdminAudio = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllAudioFiles();
      setAudioFiles(data);
    } catch (error) {
      setError("Error fetching audio files: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const handleDeleteAudio = async (id) => {
    if (window.confirm("Are you sure you want to delete this audio file?")) {
      try {
        await deleteAudioFile(id);
        setAudioFiles((prev) => prev.filter((file) => file.id !== id));
      } catch (error) {
        setError("Error deleting audio file: " + error.message);
      }
    }
  };

  if (loading) {
    return <p>Loading audio files...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">All Audio Files</h2>

      <div className="bg-white border rounded divide-y">
        {audioFiles.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">
            No audio files available.
          </p>
        ) : (
          audioFiles.map((file) => (
            <AdminAudioItem
              key={file.id}
              audioFile={file}
              onDelete={handleDeleteAudio}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAudio;
