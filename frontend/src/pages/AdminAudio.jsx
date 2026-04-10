import { useState, useEffect } from "react";

// import functions
import { fetchAllAudioFiles } from "../services/audioService";
import { deleteAudioFile } from "../services/audioService";

// import UI components
import StatusBadge from "../components/audio/StatusBadge";
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
            <div
              key={file.id}
              className="grid grid-cols-[1fr_80px_70px] items-center gap-3 p-3 items-center hover:bg-gray-50 transition"
            >
              {/* Filename and user email */}
              <div className="truncate">
                <p className="text-sm text-gray-800 truncate flex-1">
                  {file.filename}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {file.user_email}
                </p>
              </div>

              {/* Status */}
              <div className="w-full flex justify-center">
                <StatusBadge status={file.status} />
              </div>

              {/* Delete button */}
              <DeleteButton onClick={() => handleDeleteAudio(file.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAudio;
