// lib/ws-client.ts
export const connectToWebSocket = (pluginCode: string, onSessionReceived: (sessionId: string) => void) => {
  const socket = new WebSocket(`ws://localhost:8080?plugin_code=${pluginCode}`);

  console.log('Connecting to WebSocket server...');
  console.log('pluginCode:', pluginCode);

  socket.onopen = () => {
    console.log('WebSocket connection established.');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message received:', data);
    if (data.sessionId) {
      onSessionReceived(data.sessionId);
      socket.close(); // Close connection after receiving the session ID
      console.log('WebSocket connection closed. 🔴');
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    socket.close();
  };

  return socket;
};
