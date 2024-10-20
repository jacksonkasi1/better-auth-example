'use client';

import { useEffect, useState } from 'react';
import { createAuthClient } from 'better-auth/react'; // Correct import for React client

const { useSession } = createAuthClient({
  baseURL: 'http://localhost:5000/api/auth' // Make sure the base URL is correct for your auth server
});

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { data: session, isPending, error } = useSession(); // Proper use of useSession hook

  useEffect(() => {
    if (session && session.user) {
      setProfile(session.user);
    } else {
      setProfile(null);
    }
  }, [session]);

  if (isPending) return <div>Loading...</div>;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile) return <div>No profile found. Please log in.</div>;

  return (
    <div>
      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
      <h1 className="text-2xl">Welcome, {profile.name}</h1>
      {profile.image && <img src={profile.image} alt="profile" />}
      <p>Email: {profile.email}</p>
    </div>
  );
};
