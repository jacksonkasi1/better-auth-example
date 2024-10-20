'use client';
import { createAuthClient } from 'better-auth/react'; // Correct import for React client

const authClient = createAuthClient({
  baseURL: 'http://localhost:5000/api/auth' // Ensure this URL is correct for your auth server
});

export const AuthButton = () => {
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/profile', // Redirect to profile page after successful sign-in
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
