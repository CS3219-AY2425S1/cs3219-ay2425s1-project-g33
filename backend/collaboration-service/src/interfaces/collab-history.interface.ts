export interface CollabSessionHistory {
  sessionId: string;
  difficultyPreference: string;
  topicPreference: string[];
  question: {
    id: string;
    title: string;
  }
  status: string;
  date: Date;
}