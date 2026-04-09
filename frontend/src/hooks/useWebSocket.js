import { useState, useEffect } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function useWebSocket() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${SOCKET_URL}/transcriptions`);

    // Handle incoming messages
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    // Handle errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return data;
}
