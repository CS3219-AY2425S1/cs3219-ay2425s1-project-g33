import { FlaskConical, Play, Bot } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import TestCasesTabContent from "./TestCasesTabContent";
import TestResultTabContent from "./TestResultTabContent";
import AICodeReviewTabContent from "./AICodeReviewTabContent";

export default function TestResultPanel() {
  const tabs: Tab[] = [
    {
      value: "test-cases",
      label: "Test cases",
      Icon: FlaskConical,
      content: <TestCasesTabContent />,
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
      content: <AICodeReviewTabContent />
    }
  ];

  return <TabPanel tabs={tabs} defaultValue="test-cases" />;
}
