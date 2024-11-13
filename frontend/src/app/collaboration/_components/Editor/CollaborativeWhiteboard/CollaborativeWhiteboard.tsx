"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { UserProfile } from "@/types/User";
import { useYjsStore } from "@/lib/useYjsStore";

interface CollaborativeWhiteboardProps {
  sessionId: string;
  currentUser: UserProfile;
  socketUrl?: string;
}

export default function CollaborativeWhiteboard({
  sessionId,
  currentUser,
  socketUrl = "ws://localhost:4001",
}: CollaborativeWhiteboardProps) {
  const store = useYjsStore({
    roomId: `wb_${sessionId}`,
    hostUrl: `${socketUrl}/yjs?sessionId=${sessionId}&userId=${currentUser.id}`,
  });

  return (
    <div className="w-full h-full">
      <Tldraw store={store} />
    </div>
  );
}
