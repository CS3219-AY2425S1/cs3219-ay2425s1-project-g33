import CollaborativeEditor from "./CollaborativeEditor";
import { useSessionContext } from "@/contexts/SessionContext";


export default function CollaborativeEditorTab() {
  const {sessionId, userProfile} = useSessionContext();

  const socketUrl = process.env.PUBLIC_Y_WEBSOCKET_URL || "ws://localhost:4001";

  if (!userProfile) {
    return <div>Loading user profile...</div>;
  }

  return (
    <CollaborativeEditor
      sessionId={sessionId}
      currentUser={userProfile}
      socketUrl={socketUrl}
    />
  );
}
