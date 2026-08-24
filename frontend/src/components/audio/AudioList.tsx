import AudioItem from "./AudioItem";

// import types
import type { AudioFile } from "../../types";

type Props = {
  audioFiles: AudioFile[];
  onDelete: (audioFile: AudioFile) => void;
};

const AudioList = ({ audioFiles, onDelete }: Props) => {
  return (
    <>
      {!audioFiles || audioFiles.length === 0 ? (
        /* When no audio files exist */
        <div className="p-4 text-center text-gray-600 pt-10">
          No audio files uploaded yet.
        </div>
      ) : (
        /* When audio files exist */
        <div className="bg-white border rounded divide-y">
          {audioFiles.map((audioFile) => (
            <AudioItem
              key={audioFile.id}
              audioFile={audioFile}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AudioList;
