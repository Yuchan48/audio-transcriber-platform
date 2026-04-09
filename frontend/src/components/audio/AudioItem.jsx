const AudioItem = ({ audioFile, onDelete }) => {
  return (
    <div className="flex justify-between items-center border p-3 rounded mb-2">
      <div>
        <p className="font-medium">{audioFile.filename}</p>
        <StatusBadge status={audioFile.status} />
      </div>

      <button onClick={() => onDelete(audioFile.id)} className="text-red-500">
        Delete
      </button>
    </div>
  );
};

export default AudioItem;
