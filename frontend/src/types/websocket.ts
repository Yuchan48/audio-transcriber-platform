export type WebSocketUpdate = {
  status: string;
  audio_id: number;
  transcript?: string;
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
