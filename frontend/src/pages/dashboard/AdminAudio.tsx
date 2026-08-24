import { useState, useEffect } from "react";

import { toast } from "react-hot-toast";

// import functions
import { fetchAllAudioFiles } from "../../services/audioService";
import { deleteAudioFile } from "../../services/audioService";

// import UI components
import AdminAudioItem from "../../components/audio/AdminAudioItem";
import Spinner from "../../components/icons/Spinner";

// import types
import type { AudioFile } from "../../types";

const AdminAudio = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllAudioFiles();
      setAudioFiles(data);
    } catch (err) {
      if (err instanceof Error) {
        setError("Error fetching audio files: " + err.message);
      } else {
        setError("An unknown error occurred while fetching audio files.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const handleDeleteAudio = async (audioFile: AudioFile) => {
    if (
      window.confirm(
        `Are you sure you want to delete the audio file "${audioFile.filename}"?`,
      )
    ) {
      try {
        await deleteAudioFile(audioFile.id);

        setAudioFiles((prev) =>
          prev.filter((file) => file.id !== audioFile.id),
        );
        toast.success(
          `Audio file "${audioFile.filename}" deleted successfully`,
        );
      } catch (err) {
        if (err instanceof Error) {
          setError("Error deleting audio file: " + err.message);
        } else {
          setError("An unknown error occurred while deleting the audio file.");
        }
      }
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">All Audio Files</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 text-gray-600">
          <Spinner className="h-6 w-6 mb-2" />
          <p className="text-sm">Loading audio files...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      ) : audioFiles.length === 0 ? (
        <p className="flex items-center justify-center min-h-[80vh] p-4 text-gray-600 text-lg">
          No audio files available.
        </p>
      ) : (
        <div className="bg-white border rounded divide-y">
          {audioFiles.map((file) => (
            <AdminAudioItem
              key={file.id}
              audioFile={file}
              onDelete={handleDeleteAudio}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAudio;
