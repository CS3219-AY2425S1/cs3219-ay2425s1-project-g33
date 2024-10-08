export interface Operation {
  type: 'insert' | 'delete';
  position: number;
  text?: string;
  length?: number;
}