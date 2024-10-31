import { AuthButton } from "@/components/AuthButton";
import { Profile } from "@/components/Profile";

export default function Home() {
  return (
    <div className="max-w-md p-10 mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Better Auth</h1>
      <AuthButton />
      <Profile />
    </div>
  );
}
