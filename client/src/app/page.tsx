import { AuthButton } from "@/components/AuthButton";
import { Profile } from "@/components/Profile";

export default function Home() {
  return (
    <div className="p-10">
      <AuthButton />
      <Profile />
    </div>
  );
}
