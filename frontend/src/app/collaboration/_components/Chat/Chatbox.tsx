"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatBottomToolbar from "./ChatBottomToolbar";
import ChatTopToolbar from "./ChatTopToolbar";
import ChatBubbles from "./ChatBubbles";

export default function Chatbox() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        "relative flex h-full overflow-hidden",
        isCollapsed ? "w-20" : "w-96"
      )}
    >
      <div className="absolute top-0 left-0 flex flex-col h-full w-96">
        <ChatTopToolbar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <ChatBubbles isCollapsed={isCollapsed} />
        <ChatBottomToolbar isCollapsed={isCollapsed} />
      </div>
    </Card>
  );
}
