import CollaborativeWhiteboard from "./CollaborativeWhiteboard";
import { useSessionContext } from "@/contexts/SessionContext";

export default function CollaborativeEditorTab() {
  const {userProfile, sessionId} = useSessionContext()

  const socketUrl = process.env.PUBLIC_Y_WEBSOCKET_URL || "ws://localhost:4001";

  if (!userProfile) {
    return <div>Loading user profile...</div>;
  }

  return (
    <CollaborativeWhiteboard
      sessionId={sessionId}
      currentUser={userProfile}
      socketUrl={socketUrl}
    />
  );
}
