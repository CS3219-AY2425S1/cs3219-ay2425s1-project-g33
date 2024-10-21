export interface CodeChangeEvent {
  id: string;
  roomId: string;
  userId: string;
  code: string;
  timestamp: Date;
}