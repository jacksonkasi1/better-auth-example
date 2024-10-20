
import { authClient } from "@/lib/auth-client";

export const AuthButton = () => {
    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/profile",
        });
    };

    const signOut = async () => {
        await authClient.signOut();
        window.location.reload();
    };

    return (
        <div>
            <button className="btn" onClick={signInWithGoogle}>Sign In with Google</button>
            <button className="btn" onClick={signOut}>Sign Out</button>
        </div>
    );
};
