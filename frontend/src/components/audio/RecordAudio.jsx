import { useState, useRef } from "react";

import { toast } from "react-hot-toast";

// import functions
import { uploadAudioFile } from "../../services/audioService";

// import UI components
import Spinner from "../icons/Spinner";

const RecordAudio = ({ onUploadSuccess, setError, disabled }) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // start recording
  const startRecording = async () => {
    try {
      setError("");
      if (disabled) return;
      // request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      // reset audio chunks
      audioChunksRef.current = [];

      // handle dataavailable event to collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // handle stop event to process and upload audio
      mediaRecorder.onstop = handleStop;

      // start recording
      mediaRecorder.start();
      setRecording(true);

      // auto-stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          setRecording(false);
        }
      }, 30000);
    } catch (error) {
      setError("Error accessing microphone: " + error.message);
    }
  };

  // stop recording
  const stopRecording = () => {
    // stop the media recorder, which will trigger the onstop event
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // handle stop event to process and upload audio
  const handleStop = async () => {
    try {
      setLoading(true);
      // create a blob from the recorded audio chunks
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      // create file object
      const file = new File([blob], `recording_${Date.now()}.webm`, {
        type: "audio/webm",
      });

      // upload file
      await uploadAudioFile(file);

      // refresh list
      onUploadSuccess();
      toast.success(
        `Recorded audio with filename "${file.name}" uploaded successfully`,
      );
    } catch (error) {
      setError("Error stopping recording: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 bg-white flex flex-col items-center gap-3">
      {/* Button */}
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner className="h-6 w-6 mr-2" />
          <p className="text-sm text-gray-500">Uploading...</p>
        </div>
      ) : !recording ? (
        <button
          onClick={startRecording}
          className={` text-white px-4 py-2 rounded  ${disabled || loading ? "cursor-not-allowed opacity-50 bg-gray-500" : "hover:bg-blue-600 bg-blue-500"}`}
          disabled={loading || disabled}
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 animate-pulse"
        >
          ⏹ Stop Recording
        </button>
      )}

      {/* Status */}
      {recording && !loading && (
        <p className="text-sm text-gray-600">Recording... speak now</p>
      )}
    </div>
  );
};

export default RecordAudio;
