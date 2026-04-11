import { useState, useEffect } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function useWebSocket() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${SOCKET_URL}/transcriptions`);

    // Handle connection open
    ws.onopen = () => {
      console.log("WS CONNECTED");
    };

    // Handle incoming messages
    ws.onmessage = (event) => {
      console.log("WS RAW MESSAGE:", event.data);
      setData(JSON.parse(event.data));
    };

    // Handle errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle connection close
    ws.onclose = () => {
      console.log("WS CLOSED");
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return data;
}
