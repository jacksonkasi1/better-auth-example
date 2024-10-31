"use client";

import { authClient } from "@/lib/auth-client";

export const AuthButton = () => {
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // Redirect to profile page after successful sign-in
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
    <div className="grid max-w-xs grid-cols-2 gap-4 mx-auto">
      <button
        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition duration-200"
        onClick={signInWithGoogle}
      >
        Sign In
      </button>

      <button
        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition duration-200"
        onClick={signOut}
      >
        Sign Out
      </button>
    </div>
  );
};
