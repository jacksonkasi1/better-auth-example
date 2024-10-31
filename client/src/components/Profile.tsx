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

  if (isPending) return <div className="text-gray-500">Loading... ⌛</div>;

  if (error) {
    return (
      <div className="text-red-500">
        <pre>Error: {JSON.stringify(error)}</pre>
      </div>
    );
  }

  if (!profile)
    return (
      <div className="text-gray-500">No profile found. Please log in.</div>
    );

  return (
    <div className="max-w-md p-4 mx-auto my-4 space-y-4 bg-white border border-black rounded-md">
      <h1 className="text-xl font-semibold text-gray-800">
        Welcome, {profile.name}
      </h1>
      {profile.image && (
        <img
          src={profile.image.replace("=s96-c", "")} // Replace s96-c with s400-c
          alt="Profile"
          className="w-24 h-24 mx-auto border border-gray-300 rounded-full"
        />
      )}
      <p className="text-gray-700">
        Email: <span className="font-medium">{profile.email}</span>
      </p>
      <p className="text-gray-700">Bearer Token:</p>
      <div className="p-2 text-xs text-gray-600 break-words bg-gray-100 border border-gray-200 rounded">
        {bearerToken}
      </div>

      <button
        className="px-4 py-2 mt-4 text-sm font-medium text-neutral-700 bg-white border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        onClick={callPrivateApi}
      >
        Call Private API
      </button>

      {apiResponse && (
        <div className="p-3 mt-4 space-y-2 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
          <h2 className="font-semibold text-gray-800">Private API Response:</h2>
          <pre className="whitespace-pre-wrap">{apiResponse}</pre>
        </div>
      )}
    </div>
  );
};
