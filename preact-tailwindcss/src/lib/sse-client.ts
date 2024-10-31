// lib/sse-client.ts
export const connectToSSE = (onTokenReceived: (token: string) => void) => {
  const eventSource = new EventSource("http://localhost:5000/api/sse");

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.access_token) {
      onTokenReceived(data.access_token);
      eventSource.close(); // Close the connection once the token is received
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE connection error:", error);
    eventSource.close(); // Close on error
  };

  return eventSource;
};
