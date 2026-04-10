import { useState } from "react";

const UploadBox = ({ uploading, error, handleUploadAudio }) => {
  const [dragging, setDragging] = useState(false);

  // file drag & drop handler
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUploadAudio(file);
    }
  };

  // file input change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleUploadAudio(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded p-6 text-center transition
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
      `}
    >
      <p className="text-gray-600 mb-2">Drag & drop audio here</p>

      <p className="text-sm text-gray-400 mb-3">or</p>

      {/* Hidden input */}
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {/*  Custom button */}
      <label
        htmlFor="file-upload"
        className="inline-block cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition text-sm"
      >
        Choose File
      </label>

      {uploading && <p className="text-blue-500 mt-3">Uploading...</p>}

      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
    </div>
  );
};

export default UploadBox;
