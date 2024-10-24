import { MatchRequestDto } from 'src/dto';

export interface MatchDetails {
  user1: MatchRequestDto;
  user2: MatchRequestDto;
  score: number;
  generatedTopics: string[];
  generatedDifficulty: string;
  selectedQuestionId: string
}
