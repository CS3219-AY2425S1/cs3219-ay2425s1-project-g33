// components/ContextWrapper.tsx
"use client";

import CollabCodePanel from "@/app/collaboration/_components/Editor";
import TestResultPanel from "@/app/collaboration/_components/TestResult";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CodeProvider } from "@/contexts/SessionContext";
import { UserProfile } from "@/types/User";

interface ContextWrapperProps {
  sessionId: string;
  userProfile: UserProfile;
}

export default function CenterPanel({ sessionId, userProfile }: ContextWrapperProps) {
  return (
    <CodeProvider initialSessionId={sessionId} initialUserProfile={userProfile}>
      <ResizablePanelGroup direction={"vertical"}>
        <ResizablePanel className="p-1" defaultSize={70}>
          <CollabCodePanel sessionId={sessionId} />
        </ResizablePanel>

        <ResizableHandle withHandle={true} />

        <ResizablePanel className="p-1" defaultSize={30}>
          <TestResultPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </CodeProvider>
  );
}
