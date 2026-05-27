import { useState } from "react";

import type React from "react";
const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "video/webm"];

type Props = {
  uploading: boolean;
  handleUploadAudio: (file: File) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

const UploadBox = ({
  uploading,
  handleUploadAudio,
  setError,
  disabled,
}: Props) => {
  const [dragging, setDragging] = useState(false);

  // file drag & drop handler
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    setError("");
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type. Please upload an audio file.");
        return;
      }
      await handleUploadAudio(file);
    }
  };

  // file input change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    const file = e.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type. Please upload an audio file.");
        return;
      }
      await handleUploadAudio(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        if (uploading || disabled) return;
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => {
        if (uploading || disabled) return;
        setDragging(false);
      }}
      onDrop={async (e) => {
        if (uploading || disabled) return;
        handleDrop(e);
      }}
      className={`
        border-2 border-dashed rounded p-6 text-center transition
        ${dragging && !uploading && !disabled ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
      `}
    >
      <p className="text-gray-600 mb-2">Drag & drop audio here</p>

      <p className="text-sm text-gray-400 mb-3">or</p>

      {/* Hidden input */}
      <input
        id="file-upload"
        type="file"
        accept=".mp3,.wav,.m4a,.mp4,.webm,audio/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading || disabled}
      />

      {/*  Custom button */}
      <label
        htmlFor="file-upload"
        className={`inline-block cursor-pointer text-white px-4 py-2 rounded transition text-sm ${uploading || disabled ? "opacity-50 cursor-not-allowed bg-gray-600" : "hover:bg-blue-600 bg-blue-500"}`}
      >
        Choose File
      </label>

      <p className="text-xs text-gray-400 mt-2">
        Allowed formats: MP3, WAV, M4A, MP4, WEBM • Max size: 5MB
      </p>

      {uploading && <p className="text-blue-500 mt-3">Uploading...</p>}
    </div>
  );
};

export default UploadBox;
