import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinCollabSessionRequestDto } from './dto/join-collab-session-request.dto';
import {
  CHAT_SEND_MESSAGE,
  SESSION_JOIN,
  SESSION_LEAVE,
  SUBMIT,
} from './collaboration.message';
import {
  CHAT_RECIEVE_MESSAGE,
  EXCEPTION,
  SESSION_ERROR,
  SESSION_JOINED,
  SESSION_LEFT,
  SUBMITTED,
  SUBMITTING,
} from './collaborationws.event';
import { LeaveCollabSessionRequestDto } from './dto/leave-collab-session-request.dto';
import { ChatSendMessageRequestDto } from './dto/chat-send-message-request.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TestResultDataDto } from './dto/test-result.dto';
import { QuestionDto } from './dto/question.dto';

@WebSocketGateway({
  namespace: '/collaboration',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
  },
})
export class CollaborationGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private socketUserMap = new Map<string, string>(); // socketId -> userId
  private userSocketMap = new Map<string, string>(); // userId -> socktId

  constructor(
    @Inject('QUESTION_SERVICE') private questionService: ClientProxy,
    @Inject('CODE_EXECUTION_SERVICE') private codeExecutionService: ClientProxy,
    @Inject('COLLABORATION_SERVICE') private collaborationClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  @SubscribeMessage(SESSION_JOIN)
  async handleSessionJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinCollabSessionRequestDto,
  ) {
    const { userId, sessionId } = payload;

    try {
      // validate payload
      if (!userId || !sessionId) {
        throw new Error('Invalid join request payload.');
      }

      // validate session whether its active / user is allowed to be in it
      const validatedSessionDetails = await this.validateSessionDetails(
        sessionId,
        userId,
      );

      // join session socket
      this.socketUserMap.set(client.id, userId);
      this.userSocketMap.set(userId, client.id);
      client.join(sessionId);

      const sessionUserProfiles = await this.getSessionMembersUserProfiles({
        sessionId,
        userIds: validatedSessionDetails.userIds,
      });

      // fetch the chatmessages
      const { messages } = await firstValueFrom(
        this.collaborationClient.send(
          { cmd: 'get-session-chat-messages' },
          sessionId,
        ),
      );

      console.log('sessionjoin and messages retrieved:');
      console.log(messages);

      // emit joined event
      this.server.to(sessionId).emit(SESSION_JOINED, {
        userId, // the user who recently joined
        sessionId,
        messages, // chat messages
        sessionUserProfiles, // returns the all session member profiles
      });
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: `Failed to join session: ${e.message}`,
      };
    }
  }

  @SubscribeMessage(SESSION_LEAVE)
  async handleSessionLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveCollabSessionRequestDto,
  ) {
    console.log('session_leave received');
    const { userId, sessionId } = payload;

    try {
      if (!userId || !sessionId) {
        throw new Error('Invalid leave request payload.');
      }

      // validate session whether its active / user is allowed to be in it
      const validatedSessionDetails = await this.validateSessionDetails(
        sessionId,
        userId,
      );

      client.leave(sessionId);

      const sessionUserProfiles = await this.getSessionMembersUserProfiles({
        sessionId,
        userIds: validatedSessionDetails.userIds,
      });

      this.server.to(sessionId).emit(SESSION_LEFT, {
        userId,
        sessionId,
        message: 'A user left the session.',
        sessionUserProfiles,
      });
    } catch (e) {
      return {
        success: false,
        error: `Failed to leave session: ${e.message}`,
      };
    }
  }

  @SubscribeMessage(CHAT_SEND_MESSAGE)
  async handleChatSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatSendMessageRequestDto,
  ) {
    const { id, userId, sessionId, message, timestamp } = payload;

    try {
      if (!id || !userId || !sessionId || !message) {
        throw Error('Invalid send request payload.');
      }
      // add chat content inside redis memory
      await firstValueFrom(
        this.collaborationClient.send(
          { cmd: 'add-chat-message' },
          { id, userId, sessionId, message, timestamp },
        ),
      );

      this.server.to(sessionId).emit(CHAT_RECIEVE_MESSAGE, {
        id,
        userId,
        sessionId,
        message,
        timestamp,
      });

      return {
        success: true,
        data: { id },
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: { id },
        error: `Failed to send message: ${e.message}`,
      };
    }
  }

  @SubscribeMessage(SUBMIT)
  async handleSubmit(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      userId: string;
      sessionId: string;
      questionId: string;
      code: string;
    },
  ) {
    try {
      const { userId, sessionId, questionId, code } = payload;

      if (!userId || !sessionId || !code) {
        client.emit(SESSION_ERROR, 'Invalid submit request payload.');
        return;
      }

      this.server.to(sessionId).emit(SUBMITTING, {
        message: 'Submitting code...',
      });

      // Retrieve the question
      const question: QuestionDto = await firstValueFrom(
        this.questionService.send(
          { cmd: 'get-question-by-id' },
          { id: questionId },
        ),
      );

      // Run the code against the test cases
      const testResults: TestResultDataDto[] = await Promise.all(
        question.testCases.map(async (testCase) => {
          const result: TestResultDataDto = await firstValueFrom(
            this.codeExecutionService.send(
              { cmd: 'execute-code' },
              {
                code: code,
                input: testCase.input,
                language: 'python3',
                timeout: 5, // TODO: update this to the correct timeout, default is 5 seconds
              },
            ),
          );
          // Check statusCode == 200, if yes, then return
          return result;
        }),
      );

      console.log('printing testResults');
      console.log(testResults);

      // Map it to test case
      const submissionResult = testResults.map(
        (testResult: TestResultDataDto, index: number) => {
          let passed = true;
          if (testResult.status == 'error' || testResult.status == 'timeout') {
            passed = false;
          }
          if (
            testResult.status == 'ok' &&
            testResult.result.stdout.trim() !==
              question.testCases[index].expectedOutput
          ) {
            passed = false;
          }

          return {
            passed,
            compiled: testResult.status == 'ok',
            input: question.testCases[index].input,
            output:
              testResult.status == 'ok'
                ? testResult.result.stdout
                : testResult.result.stderr,
            expectedOutput: question.testCases[index].expectedOutput,
            executionTime: testResult.result.executionTime,
          };
        },
      );

      console.log('printing submissionResult');
      console.log(submissionResult);
      // Send the result back to the clients
      this.server.to(sessionId).emit(SUBMITTED, {
        message: 'Code submitted!',
        submissionResult,
      });
    } catch (error) {
      client.emit(EXCEPTION, `Error submitting code: ${error.message}`);
      return;
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // When client disconnects from the socket
    console.log(`User: ${this.socketUserMap.get(client.id)} disconnected`);
    this.debugFunction(`disconnect`);
    this.userSocketMap.delete(this.socketUserMap.get(client.id));
    this.socketUserMap.delete(client.id);
  }

  async validateSessionDetails(sessionId: string, userId: string) {
    const sessionDetails = await firstValueFrom(
      this.collaborationClient.send(
        { cmd: 'get-session-details-by-id' },
        { id: sessionId },
      ),
    );

    if (!sessionDetails || !sessionDetails.userIds.includes(userId)) {
      throw new Error(
        'Invalid session or the user is not a participant of the session',
      );
    }

    if (sessionDetails.status !== 'active') {
      throw new Error('Session is not currently active');
    }

    return sessionDetails;
  }

  async getSessionMembersUserProfiles({ sessionId, userIds }) {
    const activeUserIdSet = this.server.adapter['rooms'].get(sessionId);
    console.log('getSessionUserProfiels invoked');
    console.log(activeUserIdSet);
    const userProfilePromises = [];
    for (const userId of userIds) {
      userProfilePromises.push(
        firstValueFrom(this.userClient.send({ cmd: 'get-user-by-id' }, userId)),
      );
    }

    // set isActive flag for each profile if user is in the session
    let userProfiles = await Promise.all(userProfilePromises);
    userProfiles = userProfiles
      .map((profile) => {
        const { _id, ...profileDetails } = profile;
        return {
          id: _id,
          ...profileDetails,
          isActive: activeUserIdSet.has(this.userSocketMap.get(profile._id)),
        };
      })
      .sort((p1, p2) => p1.id.localeCompare(p2.id));

    return userProfiles;
  }

  debugFunction(eventName: string) {
    try {
      console.log(`${eventName} occured`);
      console.log(`Socket User Map:`);
      for (const [key, value] of this.socketUserMap) {
        console.log(`${key} -> ${value}`);
      }

      console.log(`Adapters:`);
      console.log(this.server.adapter['rooms']);
      console.log(this.server.adapter['sids']);
      // this.server
      //   .in(`1`)
      //   .fetchSockets()
      //   .then((v) => console.log(`room members: ${v.toString}`));
    } catch (e) {
      console.log(`ERROR!!!! ${e}`);
    }
  }
}