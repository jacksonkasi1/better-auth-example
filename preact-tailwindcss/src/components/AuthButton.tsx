// plugin/AuthButton.tsx
import { h } from "preact"; // Preact uses `h` from 'preact'
import { FunctionComponent } from "preact"; // TypeScript types for Preact functional components
import { authClient } from "../lib/auth-client"; // Custom auth client handling social login
import { connectToSSE } from "../lib/sse-client"; // SSE utility for listening to events

export const AuthButton: FunctionComponent = () => {
  const signInWithGoogle = async () => {
    try {
      // Open a browser window for Google OAuth login
      const loginUrl = "http://localhost:5000/api/make-connection";
      window.open(loginUrl, "_blank");

      // Connect to SSE to listen for login token
      connectToSSE((token: string) => {
        console.log("User logged in! Token:", token);
        // Store the token for API calls, etc.
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div>
      <button className="btn" onClick={signInWithGoogle}>
        Sign In with Google
      </button>
      <button className="btn" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};
