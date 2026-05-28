// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import useWebSocket from "../src/hooks/useWebSocket";

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent<string>) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
  });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  emitOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event("open"));
  }

  emitMessage(payload: unknown) {
    this.onmessage?.({ data: JSON.stringify(payload) } as MessageEvent<string>);
  }
}

function WebSocketHarness() {
  const { data, status } = useWebSocket(true);

  return (
    <div>
      <p data-testid="connection-status">{status}</p>
      <p data-testid="transcript">{data?.transcript ?? "no message yet"}</p>
      <p data-testid="audio-id">{data ? String(data.audio_id) : "none"}</p>
    </div>
  );
}

afterEach(() => {
  cleanup();
  MockWebSocket.instances = [];
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("useWebSocket", () => {
  it("connects, receives transcription updates, and reflects them in the UI", async () => {
    vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);

    render(<WebSocketHarness />);

    expect(screen.getByTestId("connection-status").textContent).toBe(
      "connecting",
    );
    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0].url).toBe("/ws/transcriptions");

    act(() => {
      MockWebSocket.instances[0].emitOpen();
    });

    await waitFor(() =>
      expect(screen.getByTestId("connection-status").textContent).toBe(
        "connected",
      ),
    );

    act(() => {
      MockWebSocket.instances[0].emitMessage({
        status: "completed",
        audio_id: 42,
        transcript: "Transcription finished",
      });
    });

    expect(await screen.findByText(/transcription finished/i)).toBeTruthy();
    expect(screen.getByTestId("audio-id").textContent).toBe("42");
  });
});
