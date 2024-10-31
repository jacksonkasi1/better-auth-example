import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useUserStore } from "../lib/useUserStore";

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

      try {
        const response = await fetch(`http://localhost:8087/api/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch profile`);

        const { data } = await response.json();

        setProfile({
          ...data,
          // remove it from image =s96-c
          image: data.image.replace(/=s96-c$/, ""),
        });
        setErrorMessage(null);
      } catch (error: any) {
        setErrorMessage("Error fetching profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, [sessionId, setProfile]);

  // Call private API
  const callPrivateApi = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch("http://localhost:8087/api/private-api", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setApiResponse(`Error: ${error.message || "Unknown error"}`);
    }
  };

  if (errorMessage) return <div className="text-red-500">{errorMessage}</div>;
  if (!profile) return <div>Loading profile...</div>;

  console.log("Profile:", profile);

  return (
    <div className="max-w-md p-4 mx-auto space-y-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {profile.name}
      </h1>
      {profile.image && (
        <img
          src={profile.image}
          alt="profile"
          className="w-24 h-24 mx-auto rounded-full"
        />
      )}
      <p className="text-center text-gray-600">Email: {profile.email}</p>
      <p className="text-sm text-center text-gray-400">
        Bearer Token: {sessionId}
      </p>

      <button
        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={callPrivateApi}
      >
        Call Private API
      </button>

      {apiResponse && (
        <div className="p-3 mt-4 text-sm text-gray-700 bg-gray-100 rounded-md">
          <h2 className="mb-2 font-semibold">Private API Response:</h2>
          <pre className="whitespace-pre-wrap">{apiResponse}</pre>
        </div>
      )}
    </div>
  );
};
