import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { GetCollabSessionDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { GetCurrentUserId } from 'src/common/decorators';

@ApiTags('collaboration')
@ApiBearerAuth('access-token')
@Controller('collaboration')
export class CollaborationController {
  constructor(
    @Inject('COLLABORATION_SERVICE')
    private readonly collaborationClient: ClientProxy,
  ) {}

  // Get session details by id
  @Get(':id')
  @ApiOkResponse({
    description: 'Get session details by session ID successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid session ID' })
  async getSessionDetailsById(
    @GetCurrentUserId() currentUserId,
    @Param('id') id: string,
  ) {
    console.log('[gateway] Attempt to get session details by ID', id);
    const payload: GetCollabSessionDto = { id };
    const sessionDetails = await firstValueFrom(
      this.collaborationClient.send(
        { cmd: 'get-session-details-by-id' },
        payload,
      ),
    );

    if (sessionDetails.status !== 'active') {
      throw new ForbiddenException('Session is not currently active');
    }

    // Check if the current user is in the session's userIds array
    if (!sessionDetails.userIds.includes(currentUserId)) {
      throw new UnauthorizedException(
        'You are not a participant to the given session',
      );
    }

    const { _id, ...sessionDetail } = sessionDetails;

    return {
      id: _id,
      ...sessionDetail,
    };
  }
}
