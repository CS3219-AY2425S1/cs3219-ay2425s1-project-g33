import { Inject, Injectable } from '@nestjs/common';
import { MatchRequestDto } from '../dto';
import { RedisService } from './redis.service';
import { AppService } from 'src/app.service';
import { v4 as uuidv4 } from 'uuid';
import { MatchDetails } from '../interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MatchWorkerService {
  constructor(
    private readonly redisService: RedisService,
    private readonly appService: AppService,
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {}

  private INTERNAL_TIMEOUT = 300000; // 5 minutes
  private CHECK_INTERVAL = 5000; // 5 seconds

  // Poll for matches at a regular interval
  async pollForMatches() {
    setInterval(async () => {
      const users = await this.redisService.getAllUsersFromPool();
      const currentTime = Date.now();
      const timeout = this.INTERNAL_TIMEOUT; // 5 minutes to remove any zombie users
      console.log('Polling', users);
      // Filter out users who have timed out
      const activeUsers = users.filter(
        (user) => currentTime - user.timestamp < timeout,
      );

      if (activeUsers.length < users.length) {
        const timedOutUsers = users.filter(
          (user) => currentTime - user.timestamp >= timeout,
        );
        await this.notifyGatewayTimeout(
          timedOutUsers.map((user) => user.userId),
        );
        await this.redisService.removeUsersFromPool(
          timedOutUsers.map((user) => user.userId),
        );
      }

      if (activeUsers.length >= 2) {
        const matches = await this.rankUsers(activeUsers);
        const bestMatch = matches[0];
        const matchId = uuidv4();

        await this.redisService.storeMatch(matchId, bestMatch);

        // Notify the gateway via Redis Pub/Sub
        await this.notifyGateway({
          matchId: matchId,
          matchedUserIds: [bestMatch.user1.userId, bestMatch.user2.userId],
        });

        // Remove the matched users from the Redis pool
        await this.redisService.removeUsersFromPool([
          bestMatch.user1.userId,
          bestMatch.user2.userId,
        ]);

        console.log('Matched users', bestMatch);
      }
    }, this.CHECK_INTERVAL);
  }

  // Ranking logic for matches
  private async rankUsers(users: MatchRequestDto[]): Promise<MatchDetails[]> {
    const matches: MatchDetails[] = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const { topics, difficulty } = this.generateMatchAttributes(
          users[i],
          users[j],
        );
        const score = this.calculateScore(users[i], users[j]);
        const selectedQuestion = await this.generateQuestion(
          topics,
          difficulty,
        );
        const match: MatchDetails = {
          user1: users[i],
          user2: users[j],
          score,
          generatedTopics: topics,
          generatedDifficulty: difficulty,
          selectedQuestionId: selectedQuestion._id,
        };
        matches.push(match);
      }
    }
    return matches.sort((a, b) => b.score - a.score);
  }

  private calculateScore(
    user1: MatchRequestDto,
    user2: MatchRequestDto,
  ): number {
    let score = 0;
    const matchingTopics = user1.selectedTopic.filter((topic) =>
      user2.selectedTopic.includes(topic),
    );
    score += matchingTopics.length * 3; // Priority given to selectedTopics with higher weight
    if (user1.selectedDifficulty === user2.selectedDifficulty) {
      score += 1;
    }
    return score;
  }

  private async generateQuestion(topics: string[], difficulty: string) {
    const questions = await firstValueFrom(
      this.questionClient.send(
        { cmd: 'get-question-by-preferences' },
        { difficulty, topics },
      ),
    );
    return questions[0];
  }

  private generateMatchAttributes(
    user1: MatchRequestDto,
    user2: MatchRequestDto,
  ): { topics: string[]; difficulty: string } {
    // Find common topics between the two users
    const matchingTopics = user1.selectedTopic.filter((topic) =>
      user2.selectedTopic.includes(topic),
    );

    // If common topics exist, use them, otherwise, choose a fallback strategy
    const generatedTopics =
      matchingTopics.length > 0
        ? matchingTopics
        : this.selectAlternativeTopics();

    // Generate a difficulty based on both users' selected difficulty levels
    const generatedDifficulty = this.inferDifficulty(
      user1.selectedDifficulty,
      user2.selectedDifficulty,
    );

    return { topics: generatedTopics, difficulty: generatedDifficulty };
  }

  // TODO: Implement a more sophisticated algorithm to generate alternative topics (e.g considering user topic preferences selected during onboarding)
  private selectAlternativeTopics(): string[] {
    const QUESTION_CATEGORIES = [
      'Array',
      'Binary Search',
      'Divide and Conquer',
      'Dynamic Programming',
      'Hash Table',
      'Linked List',
      'Math',
      'Sliding Window',
      'Stack',
      'String',
      'Two Sum',
    ];
    const NUM_QUESTIONS_TO_GENERATE = 2;
    // Simply generate 2 random topics for now
    const generatedTopics = [];
    while (generatedTopics.length < NUM_QUESTIONS_TO_GENERATE) {
      const randomIndex = Math.floor(
        Math.random() * QUESTION_CATEGORIES.length,
      );
      const randomTopic = QUESTION_CATEGORIES[randomIndex];
      if (!generatedTopics.includes(randomTopic)) {
        generatedTopics.push(randomTopic);
      }
    }
    return generatedTopics;
  }

  private inferDifficulty(difficulty1: string, difficulty2: string): string {
    // Case 1: Both users have the same difficulty
    if (difficulty1 === difficulty2) {
      return difficulty1;
    }

    // Case 2: Both users have different difficulties, return the median difficulty
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const index1 = difficulties.indexOf(difficulty1);
    const index2 = difficulties.indexOf(difficulty2);

    return difficulties[Math.floor((index1 + index2) / 2)];
  }

  async notifyGateway(data: { matchId: string; matchedUserIds: string[] }) {
    await this.redisService.publishMatchedUsers(
      data.matchId,
      data.matchedUserIds,
    );
  }

  async notifyGatewayTimeout(userIds: string[]) {
    await this.redisService.publishTimedOutUsers(userIds);
  }
}
