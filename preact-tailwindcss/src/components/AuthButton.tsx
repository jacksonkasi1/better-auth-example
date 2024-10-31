// plugin/AuthButton.tsx
import { h } from "preact";
import { FunctionComponent } from "preact";
import { v4 as uuidv4 } from "uuid";
import { connectToWebSocket } from "../lib/ws-client";
import { useUserStore } from "../lib/useUserStore";

export const AuthButton: FunctionComponent = () => {
  const setSessionId = useUserStore((state) => state.setSessionId);

  const handleSignIn = async () => {
    const pluginCode = uuidv4();
    const loginUrl = `http://localhost:3000/plugin-login?code=${pluginCode}`;
    window.open(loginUrl, "_blank");

    connectToWebSocket(pluginCode, (sessionId: string) => {
      console.log("Received session ID:", sessionId);
      setSessionId(sessionId);
    });
  };

  return (
    <button
      className="px-4 py-2 font-semibold text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={handleSignIn}
    >
      Sign In with Google
    </button>
  );
};
