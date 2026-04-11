import { useAudioExpand } from "../../hooks/useAudioExpand";

// import UI components
import StatusBadge from "../icons/StatusBadge";
import DeleteButton from "../buttons/DeleteButton";

const AudioItem = ({ audioFile, onDelete }) => {
  const { open, toggleExpand, audioUrl, transcript, loading, error } =
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
        <DeleteButton onClick={() => onDelete(audioFile.id)} />
      </div>

      {/* Expanded content */}
      {open && (
        <div className="p-4 bg-gray-50 space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
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
