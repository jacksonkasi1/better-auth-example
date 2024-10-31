import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

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
