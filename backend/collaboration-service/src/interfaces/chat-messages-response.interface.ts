export interface ChatMessagesResponse {
  messages: {
    id: string;
    userId: string;
    sessionId: string;
    message: string;
    timestamp: string;
  }[];
}
