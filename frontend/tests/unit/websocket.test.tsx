// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import useWebSocket from "../../src/hooks/useWebSocket";

// A mock WebSocket class to simulate WebSocket behavior in tests without making real network connections
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

  // Helper method to simulate the WebSocket connection opening and trigger the onopen event
  emitOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event("open"));
  }

  // Helper method to simulate receiving a message and trigger the onmessage event with the provided payload
  emitMessage(payload: unknown) {
    this.onmessage?.({ data: JSON.stringify(payload) } as MessageEvent<string>);
  }
}

// A simple test component that uses the useWebSocket hook to display connection status and received data
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

// Clean up after each test
afterEach(() => {
  cleanup();
  MockWebSocket.instances = [];
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("useWebSocket", () => {
  // Test that the hook establishes a connection, receives messages, and updates the UI accordingly
  it("connects, receives transcription updates, and reflects them in the UI", async () => {
    // Stub the global WebSocket with our MockWebSocket to intercept WebSocket interactions during the test
    vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);

    render(<WebSocketHarness />);

    // Assert that the initial connection status is "connecting" and that a WebSocket instance was created with the correct URL
    expect(screen.getByTestId("connection-status").textContent).toBe(
      "connecting",
    );
    // Assert that one WebSocket instance was created and that it was initialized with the expected URL
    expect(MockWebSocket.instances).toHaveLength(1);
    // Assert that the WebSocket was initialized with the correct URL for receiving transcription updates
    expect(MockWebSocket.instances[0]?.url).toBe("/ws/transcriptions");

    // Simulate the WebSocket connection opening
    act(() => {
      MockWebSocket.instances[0]?.emitOpen();
    });

    // Assert that the connection status updates to "connected" after the WebSocket connection is established
    await waitFor(() =>
      expect(screen.getByTestId("connection-status").textContent).toBe(
        "connected",
      ),
    );

    // Simulate receiving a transcription update message from the WebSocket
    act(() => {
      MockWebSocket.instances[0]?.emitMessage({
        status: "completed",
        audio_id: 42,
        transcript: "Transcription finished",
      });
    });

    // Assert that the UI updates to show the received transcription and audio ID
    expect(await screen.findByText(/transcription finished/i)).toBeTruthy();
    expect(screen.getByTestId("audio-id").textContent).toBe("42");
  });

  // Test that the hook attempts to reconnect when the WebSocket connection is closed unexpectedly
  it("reconnects when the WebSocket connection closes", async () => {
    vi.useFakeTimers();

    vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);

    render(<WebSocketHarness />);

    expect(MockWebSocket.instances).toHaveLength(1);

    act(() => {
      MockWebSocket.instances[0]?.emitOpen();
    });

    act(() => {
      MockWebSocket.instances[0]?.onclose?.(new CloseEvent("close"));
    });

    expect(screen.getByTestId("connection-status").textContent).toBe(
      "disconnected",
    );

    // First reconnect uses a 1-second delay.
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(MockWebSocket.instances).toHaveLength(2);

    vi.useRealTimers();
  });
});
