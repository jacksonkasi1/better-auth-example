import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useUserStore } from "../lib/useUserStore"; // Import Zustand store

export const Profile = () => {
  const profile = useUserStore((state) => state.profile);
  const sessionId = useUserStore((state) => state.sessionId);
  const setProfile = useUserStore((state) => state.setProfile);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch user profile data when sessionId changes
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!sessionId) {
        setErrorMessage("No profile found. Please log in.");
        setProfile(null);
        return;
      }

      console.log("Fetching profile data...", sessionId);

      try {
        const response = await fetch(`http://localhost:8087/api/me`, {
          method: "GET",
          headers: {
            ContentType: "application/json",
            Authorization: `Bearer ${sessionId}`, // Use sessionId from Zustand store
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch profile. Status: ${response.status}`,
          );
        }

        const data = await response.json();
        setProfile(data); // Update Zustand store with fetched profile
        setErrorMessage(null); // Clear any previous error
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setErrorMessage("Error fetching profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, [sessionId, setProfile]);

  // API call to /api/private-api
  const callPrivateApi = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch("http://localhost:8087/api/me", {
        method: "GET",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${sessionId}`, // Use sessionId from Zustand store
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.error("Error calling private API:", error);
      setApiResponse(`Error: ${error?.message || "Unknown error"}`);
    }
  };

  // Render profile or error message if no sessionId
  if (errorMessage) return <div>{errorMessage}</div>;

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
      <h1 className="text-2xl">Welcome, {profile.name}</h1>
      {profile.image && <img src={profile.image} alt="profile" />}
      <p>Email: {profile.email}</p>
      <hr />
      <p>Bearer Token: {sessionId}</p>

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
