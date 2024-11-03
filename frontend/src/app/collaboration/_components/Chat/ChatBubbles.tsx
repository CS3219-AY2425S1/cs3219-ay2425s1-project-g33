"use client";

import { CardContent } from "@/components/ui/card";
import { useSessionContext } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatMessageStatusEnum } from "@/types/ChatMessage";
import { Check, Clock, XCircle } from "lucide-react";
import React, { useMemo } from "react";

interface ChatBubblesProps {
  isCollapsed: boolean;
}

export default function ChatBubbles({ isCollapsed }: ChatBubblesProps) {
  const { messages, userProfile } = useSessionContext();

  if (!userProfile) {
    return <div>Loading user profile...</div>;
  }

  return (
    <CardContent
      className={cn(
        "transition-all duration-300",
        "flex flex-col overflow-scroll whitespace-no-wrap",
        isCollapsed && "opacity-0"
      )}
    >
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <ChatBubble message={message} />
        </React.Fragment>
      ))}
    </CardContent>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
}

function ChatBubble({ message }: ChatBubbleProps) {
  const { userProfile, getUserProfileDetailByUserId } = useSessionContext();

  const profileDetails = useMemo(() => {
    return getUserProfileDetailByUserId(message.userId);
  }, [message]);

  const isSender = useMemo(() => {
    return message.userId === userProfile?.id;
  }, []);

  const statusIcon = useMemo(() => {
    switch (message.status) {
      case ChatMessageStatusEnum.enum.sending:
        return <Clock size={14} />;
      case ChatMessageStatusEnum.enum.sent:
        return <Check size={14} />;
      default:
        return <XCircle size={14} />;
    }
  }, [message.status]);

  return (
    <div
      className={cn(
        `flex flex-col mb-4 whitespace-pre-wrap`,
        isSender ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">
          {profileDetails?.displayName}
        </span>
      </div>
      <div
        className={cn(
          `px-3 py-2 rounded-lg`,
          isSender ? "bg-primary text-primary-foreground" : "bg-violet-400/15"
        )}
      >
        <p>{message.message}</p>
        <div className="flex w-full justify-end">
          <small className="flex items-center uppercase">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {isSender && statusIcon}
          </small>
        </div>
      </div>
    </div>
  );
}
