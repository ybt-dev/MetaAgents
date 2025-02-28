import { Controller, Get, Param, Post, Body, Query, UseGuards } from '@nestjs/common';
import { Session } from '@apps/platform/sessions/decorators';
import { SessionData } from '@apps/platform/sessions/types';
import { SessionGuard } from '@apps/platform/sessions/guards';
import { AgentTeamInteractionService } from '@apps/platform/agents/services';
import {
  CreateAgentTeamInteractionBodyDto,
  ListAgentTeamInteractionsQueryDto,
  SendReplyMessageToInteractionBodyDto,
} from '@apps/platform/agents/dto';
import { InjectAgentTeamInteractionService } from '@apps/platform/agents/decorators';

@Controller('/agent-team-interactions')
@UseGuards(SessionGuard)
export default class AgentTeamInteractionController {
  constructor(
    @InjectAgentTeamInteractionService() private readonly agentTeamInteractionService: AgentTeamInteractionService,
  ) {}

  @Get('/')
  public listInteractions(@Session() session: SessionData, @Query() query: ListAgentTeamInteractionsQueryDto) {
    return this.agentTeamInteractionService.listByTeam(query.teamId, session.organizationId);
  }

  @Get('/:id')
  public getInteractionById(@Session() session: SessionData, @Param('id') id: string) {
    return this.agentTeamInteractionService.getIfExist(id, session.organizationId);
  }

  @Post('/')
  public createInteraction(@Session() session: SessionData, @Body() body: CreateAgentTeamInteractionBodyDto) {
    return this.agentTeamInteractionService.create({
      title: body.title,
      requestContent: body.requestContent,
      organizationId: session.organizationId,
      teamId: body.teamId,
      createdById: session.userId,
    });
  }

  @Post('/:id/reply')
  public async sendReplyMessage(
    @Session() session: SessionData,
    @Param('id') interactionId: string,
    @Body() body: SendReplyMessageToInteractionBodyDto,
  ) {
    return this.agentTeamInteractionService.sendReplyMessage({
      interactionId,
      organizationId: session.organizationId,
      content: body.content,
      createdById: session.userId,
    });
  }
}
