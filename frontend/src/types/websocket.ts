export type WebSocketUpdate = {
  status: string;
  audio_id: string;
  transcript?: string;
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
