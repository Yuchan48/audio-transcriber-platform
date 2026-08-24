import { useState, useEffect, useRef } from "react";

// import types
import type { WebSocketUpdate, ConnectionStatus } from "../types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "/ws";

export default function useWebSocket(enabled: boolean) {
  const [data, setData] = useState<WebSocketUpdate | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(
    enabled ? "connecting" : "disconnected",
  );

  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let ws: WebSocket | null = null;

    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isUnmounted = false;

    const connect = () => {
      setStatus("connecting");
      ws = new WebSocket(`${SOCKET_URL}/transcriptions`);

      // Handle connection open
      ws.onopen = () => {
        reconnectAttempts.current = 0; // Reset on successful connection
        setStatus("connected");
      };

      // Handle incoming messages
      ws.onmessage = (event) => {
        setData(JSON.parse(event.data));
      };

      // Handle errors
      ws.onerror = () => {
        setStatus("disconnected");
      };
      ws.onclose = () => {
        if (isUnmounted) return;
        setStatus("disconnected");
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 10000); // Exponential backoff up to 10 seconds

        reconnectAttempts.current += 1;

        reconnectTimeout = setTimeout(() => {
          connect();
        }, delay);
      };
    };
    connect();

    // Cleanup on unmount
    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimeout);
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }
      // ws?.close();
    };
  }, [enabled]);

  return { data, status };
}
