"use client";

import CollabCodePanel from "@/app/collaboration/_components/Editor";
import TestResultPanel from "@/app/collaboration/_components/TestResult";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodeReviewAnimationProvider } from "@/contexts/CodeReviewAnimationContext";
import { Question } from "@/types/Question";

interface ContextWrapperProps {
  question: Question;
}

export default function CenterPanel({
  question,
}: ContextWrapperProps) {
  return (

      <CodeReviewAnimationProvider>
        <ResizablePanelGroup direction={"vertical"}>
          <ResizablePanel className="p-1" defaultSize={70}>
            <CollabCodePanel />
          </ResizablePanel>

          <ResizableHandle withHandle={true} />

          <ResizablePanel className="p-1" defaultSize={30}>
            <TestResultPanel question={question} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </CodeReviewAnimationProvider>
  );
}
