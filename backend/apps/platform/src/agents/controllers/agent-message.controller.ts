import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Session } from '@apps/platform/sessions/decorators';
import { SessionData } from '@apps/platform/sessions/types';
import { SessionGuard } from '@apps/platform/sessions/guards';
import { AgentMessageService } from '@apps/platform/agents/services';
import { ListAgentMessagesQueryDto } from '@apps/platform/agents/dto';
import { InjectAgentMessageService } from '@apps/platform/agents/decorators';

@Controller('/agent-messages')
@UseGuards(SessionGuard)
export default class AgentMessageController {
  constructor(@InjectAgentMessageService() private readonly agentMessageService: AgentMessageService) {}

  @Get('/')
  public listInteractions(@Session() session: SessionData, @Query() query: ListAgentMessagesQueryDto) {
    return this.agentMessageService.listByInteractionId(query.interactionId, session.organizationId);
  }
}
