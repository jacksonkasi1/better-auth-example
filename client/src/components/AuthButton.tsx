'use client';

import { authClient } from "@/lib/auth-client";


export const AuthButton = () => {
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/', // Redirect to profile page after successful sign-in
      });
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error during sign-out:', error);
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
