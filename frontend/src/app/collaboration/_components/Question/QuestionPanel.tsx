import { ClipboardList, SquareCheck } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import SolutionTabContent from "./SolutionTabContent";
import DescriptionTabContent from "./DescriptionTabContent";
import { Question } from "@/types/Question";

export default function QuestionTabPanel({ question }: { question: Question }) {
  const tabs: Tab[] = [
    {
      value: "description",
      label: "Description",
      Icon: ClipboardList,
      content: <DescriptionTabContent question={question} />,
    },
    {
      value: "solution",
      label: "Solution",
      Icon: SquareCheck,
      content: <SolutionTabContent />,
    },
  ];

  return <TabPanel tabs={tabs} defaultValue="description" />;
}
