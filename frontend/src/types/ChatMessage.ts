import { z } from "zod";

const ChatMessageStatusEnum = z.enum(["sending", "failed", "sent"]);

const ChatMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  message: z.string(),
  status: ChatMessageStatusEnum,
  timestamp: z.string().datetime(),
});

const ChatMessagesSchema = z.array(ChatMessageSchema);

type ChatMessageStatus = z.infer<typeof ChatMessageStatusEnum>;

type ChatMessage = z.infer<typeof ChatMessageSchema>;
type ChatMessages = z.infer<typeof ChatMessagesSchema>;

export {
  ChatMessageStatusEnum,
  ChatMessageSchema,
  ChatMessagesSchema,
  type ChatMessageStatus,
  type ChatMessage,
  type ChatMessages,
};
