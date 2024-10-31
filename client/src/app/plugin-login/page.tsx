"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const PluginLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams to access query params
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePluginLogin = async () => {
      try {
        const code = searchParams.get("code"); // Get 'code' from searchParams

        // Validate the presence of the code
        if (!code) {
          throw new Error("Missing 'code' parameter in the URL.");
        }

        // Attempt to set the plugin_code in cookies
        try {
          document.cookie = `plugin_code=${code}; path=/; SameSite=Lax`; // Set cookie with SameSite=Lax
        } catch (cookieError) {
          throw new Error(
            "Failed to set cookie. Please check your browser settings.",
          );
        }

        // Redirect to the main page after storing the code
        router.replace("/");
      } catch (err) {
        console.error("Error during plugin login:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      }
    };

    handlePluginLogin();
  }, [searchParams, router]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Redirecting...</div>;
};

export default PluginLogin;
