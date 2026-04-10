import StatusBadge from "./StatusBadge";
import DeleteButton from "../buttons/DeleteButton";

const AudioItem = ({ audioFile, onDelete }) => {
  return (
    <div className="grid grid-cols-[1fr_80px_70px] items-center gap-3 p-3 hover:bg-gray-50 transition">
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
  );
};

export default AudioItem;
