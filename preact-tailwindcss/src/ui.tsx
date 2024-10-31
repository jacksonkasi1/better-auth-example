import { render } from '@create-figma-plugin/ui';
import { h } from 'preact';
import '!./output.css';
import { AuthButton } from './components/AuthButton';
import { Profile } from './components/Profile';
import { useUserStore } from "./lib/useUserStore";

function Plugin() {
  const sessionId = useUserStore((state) => state.sessionId);

  return (
    <div className="flex flex-col items-center max-w-sm p-4 mx-auto space-y-4 rounded-lg bg-gray-50">
      {sessionId ? <Profile /> : <AuthButton />}
    </div>
  );
}

export default render(Plugin);
