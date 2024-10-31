// plugin/AuthButton.tsx
import { h } from "preact";
import { FunctionComponent } from "preact";
import { v4 as uuidv4 } from "uuid";
import { connectToWebSocket } from "../lib/ws-client";
import { useUserStore } from "../lib/useUserStore"; // Import Zustand store

export const AuthButton: FunctionComponent = () => {
  const setSessionId = useUserStore((state) => state.setSessionId);

  const signInWithGoogle = async () => {
    try {
      const pluginCode = uuidv4();
      const loginUrl = `http://localhost:3000/plugin-login?code=${pluginCode}`;
      window.open(loginUrl, "_blank");

      // Connect to WebSocket using pluginCode as channel ID
      connectToWebSocket(pluginCode, (sessionId: string) => {
        console.log("Session ID received via WebSocket:", sessionId);
        setSessionId(sessionId); // Store sessionId in Zustand store
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div>
      <button className="btn" onClick={signInWithGoogle}>
        Sign In with Google
      </button>
    </div>
  );
};
