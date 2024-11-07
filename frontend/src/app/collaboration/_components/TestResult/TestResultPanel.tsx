import { FlaskConical, Play, Bot } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import TestCasesTabContent from "./TestCasesTabContent";
import TestResultTabContent from "./TestResultTabContent";
import AICodeReviewTabContent from "./AICodeReviewTabContent";
import { Question } from "@/types/Question";
import { useSessionContext } from "@/contexts/SessionContext";

interface TestResultPanelProps {
  question: Question;
}

export default function TestResultPanel({ question }: TestResultPanelProps) {
  const { testResultPanel, setTestResultPanel } = useSessionContext();

  const tabs: Tab[] = [
    {
      value: "test-cases",
      label: "Test cases",
      Icon: FlaskConical,
      content: <TestCasesTabContent question={question} />,
    },
    {
      value: "test-result",
      label: "Test result",
      Icon: Play,
      content: <TestResultTabContent />,
    },
    {
      value: "ai-code-review",
      label: "AI Code review",
      Icon: Bot,
      content: <AICodeReviewTabContent />,
    },
  ];

  return (
    <TabPanel
      tabs={tabs}
      defaultValue="test-cases"
      value={testResultPanel}
      onValueChange={setTestResultPanel}
    />
  );
}
