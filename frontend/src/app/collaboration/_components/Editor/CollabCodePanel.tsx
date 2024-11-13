import { Code, Pencil } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import CollaborativeEditorTab from "./CollaborativeEditor/CollaborativeEditorTab";
import CollaborativeWhiteboardTab from "./CollaborativeWhiteboard/CollaborativeWhiteboardTab";
import LanguageSelector from "./CollaborativeEditor/LanguageSelector";

export function CollabCodePanel() {
  const tabs: Tab[] =
    process.env.NEXT_PUBLIC_WHITEBOARD_FEATURE === "true"
      ? [
          {
            value: "code",
            label: "Code",
            Icon: Code,
            content: <CollaborativeEditorTab />,
          },
          {
            value: "whiteboard",
            label: "Whiteboard",
            Icon: Pencil,
            content: <CollaborativeWhiteboardTab />,
          },
        ]
      : [
          {
            value: "code",
            label: "Code",
            Icon: Code,
            content: <CollaborativeEditorTab />,
          },
        ];

  return (
    <TabPanel
      tabs={tabs}
      defaultValue={"code"}
      tabChildren={<LanguageSelector className="ml-auto" />}
    />
  );
}
