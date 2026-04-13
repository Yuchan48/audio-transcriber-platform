import { useAudioExpand } from "../../hooks/useAudioExpand";

// import UI components
import StatusBadge from "../icons/StatusBadge";
import DeleteButton from "../buttons/DeleteButton";
import Spinner from "../icons/Spinner";

const AudioItem = ({ audioFile, onDelete }) => {
  const { open, toggleExpand, audioUrl, transcript, loading, fetchAudioError } =
    useAudioExpand(audioFile);

  return (
    <div>
      {/* Row */}
      <div
        onClick={toggleExpand}
        className="grid grid-cols-[1fr_80px_70px] items-center gap-3 p-3 hover:bg-gray-50 transition"
      >
        {/* Filename */}
        <p className="text-sm text-gray-800 truncate flex-1">
          {audioFile.filename}
        </p>

        {/* Status */}
        <div className="w-full flex justify-center">
          <StatusBadge status={audioFile.status} />
        </div>

        {/* Delete button */}
        <DeleteButton onClick={() => onDelete(audioFile)} />
      </div>

      {/* Expanded content */}
      {open && (
        <div className="p-4 bg-gray-50 space-y-3">
          {fetchAudioError ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
              <span>⚠️</span>
              <span>{fetchAudioError}</span>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center">
              <Spinner className="h-6 w-6 mr-2" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {/* Audio Player */}
              {audioUrl && (
                <audio controls className="w-full">
                  <source src={audioUrl} />
                </audio>
              )}

              {/* Transcript */}
              <div className="bg-white p-3 border rounded text-sm whitespace-pre-wrap">
                {transcript || "No transcript available"}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioItem;
