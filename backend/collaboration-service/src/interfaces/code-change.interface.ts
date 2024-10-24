export interface CodeChangeEvent {
  eventId: string;
  roomId: string;
  userId: string;
  operationType: 'insert' | 'delete';
  position: number;
  text: string
  version: number;
  timestamp: Date;
}