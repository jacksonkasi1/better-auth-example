// plugin/AuthButton.tsx
import { h } from "preact";
import { FunctionComponent } from "preact";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import { connectToWebSocket } from "../lib/ws-client"; // WebSocket utility

export const AuthButton: FunctionComponent = () => {
  const signInWithGoogle = async () => {
    try {
      // Generate a unique UUID for the plugin session
      const pluginCode = uuidv4();

      // Open the frontend login page with the UUID in the URL
      const loginUrl = `http://localhost:3000/plugin-login?code=${pluginCode}`;
      window.open(loginUrl, "_blank");

      // Connect to WebSocket using pluginCode as channel ID
      connectToWebSocket(pluginCode, (sessionId: string) => {
        console.log("Session ID received via WebSocket:", sessionId);
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
