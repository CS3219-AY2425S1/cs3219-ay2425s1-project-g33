import { getSessionInfo } from "@/services/collaborationService";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import CollabCodePanel from "@/app/collaboration/_components/Editor";
import TestResultPanel from "@/app/collaboration/_components/TestResult";
import QuestionTabPanel from "@/app/collaboration/_components/Question";
import Chatbox from "../_components/Chat/Chatbox";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { sessionId: string };
}) {
  const { sessionId } = params;

  const sessionInfoResponse = await getSessionInfo(sessionId);

  if (sessionInfoResponse.statusCode !== 200 || !sessionInfoResponse.data) {
    redirect("/dashboard");
  }

  const chatFeature = process.env.NEXT_PUBLIC_CHAT_FEATURE === "true";

  return (
    <div className="flex flex-row w-full h-full overflow-hidden">
      <ResizablePanelGroup
        className="flex w-full h-full"
        direction="horizontal"
      >
        <ResizablePanel className="p-1" defaultSize={30}>
          <QuestionTabPanel />
        </ResizablePanel>

        <ResizableHandle withHandle={true} />

        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction={"vertical"}>
            <ResizablePanel className="p-1" defaultSize={70}>
              <CollabCodePanel sessionId={sessionId} />
            </ResizablePanel>

            <ResizableHandle withHandle={true} />

            <ResizablePanel className="p-1" defaultSize={30}>
              <TestResultPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      {chatFeature && (
        <div className="flex p-1">
          <Chatbox />
        </div>
      )}
    </div>
  );
}
