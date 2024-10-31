"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";

const { useSession } = createAuthClient({
  baseURL: "http://localhost:5000/api/auth", // Ensure this URL points to your auth server
});

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null); // Store API response
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration state
  const { data, isPending, error } = useSession(); // Use the useSession hook

  useEffect(() => {
    setIsHydrated(true); // Mark hydrated as true when client-side rendering starts
  }, []);

  useEffect(() => {
    if (data && data.session.id) {
      setProfile(data.user);
      setBearerToken(data.session.id); // Set the bearer token after successful authentication
    } else {
      setProfile(null);
    }
  }, [data]);

  // API call to /api/private-api
  const callPrivateApi = async () => {
    if (!bearerToken) return;

    try {
      const response = await fetch("http://localhost:5000/api/private-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Send the Bearer token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2)); // Store the API response
    } catch (error: any) {
      console.error("Error calling private API:", error);
      setApiResponse(`Error: ${error?.message || "Unknown error"}`);
    }
  };

  // Return nothing or fallback if hydration hasn't completed
  if (!isHydrated) return null;

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
      <hr />
      <p>Bearer Token: {bearerToken}</p>

      {/* Button to call the private API */}
      <button className="btn" onClick={callPrivateApi}>
        Call Private API
      </button>

      {/* Display the private API response */}
      {apiResponse && (
        <div>
          <h2>Private API Response:</h2>
          <pre>
            <code>{apiResponse}</code>
          </pre>
        </div>
      )}
    </div>
  );
};