import AudioItem from "./AudioItem";

const AudioList = ({ audioFiles, onDelete }) => {
  if (!audioFiles || audioFiles.length === 0) {
    return <div className="text-gray-500">No audio files uploaded yet.</div>;
  }
  return (
    <div>
      {audioFiles.map((audioFile) => (
        <AudioItem
          key={audioFile.id}
          audioFile={audioFile}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AudioList;
