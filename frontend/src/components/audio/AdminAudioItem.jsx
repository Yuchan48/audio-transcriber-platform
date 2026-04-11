import { useAudioExpand } from "../../hooks/useAudioExpand";

// import UI components
import StatusBadge from "../icons/StatusBadge";
import DeleteButton from "../buttons/DeleteButton";

const AdminAudioItem = ({ audioFile, onDelete }) => {
  const { open, toggleExpand, audioUrl, transcript, loading, error } =
    useAudioExpand(audioFile);
  return (
    <div>
      {/* Row */}
      <div
        className="grid grid-cols-[1fr_80px_70px] items-center gap-3 p-3 items-center hover:bg-gray-50 transition"
        onClick={toggleExpand}
      >
        {/* Filename and user email */}
        <div className="truncate">
          <p className="text-sm text-gray-800 truncate flex-1">
            {audioFile.filename}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {audioFile.user_email}
          </p>
        </div>

        {/* Status */}
        <div className="w-full flex justify-center">
          <StatusBadge status={audioFile.status} />
        </div>

        {/* Delete button */}
        <DeleteButton onClick={() => onDelete(audioFile.id)} />
      </div>
      {/* Expand content*/}
      {open && (
        <div className="p-4 bg-gray-50">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {audioUrl && <audio controls src={audioUrl} className="w-full" />}

              <div className="mt-3 bg-white border p-3 text-sm whitespace-pre-wrap">
                {transcript}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAudioItem;
