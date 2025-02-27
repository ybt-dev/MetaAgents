import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Session } from '@apps/platform/sessions/decorators';
import { SessionData } from '@apps/platform/sessions/types';
import { SessionGuard } from '@apps/platform/sessions/guards';
import { InteractionMessageService } from '@apps/platform/agents/services';
import { ListInteractionMessagesQueryDto } from '@apps/platform/agents/dto';
import { InjectInteractionMessageService } from '@apps/platform/agents/decorators';

@Controller('/interaction-messages')
@UseGuards(SessionGuard)
export default class InteractionMessageController {
  constructor(
    @InjectInteractionMessageService() private readonly interactionMessageService: InteractionMessageService,
  ) {}

  @Get('/')
  public listInteractionMessages(@Session() session: SessionData, @Query() query: ListInteractionMessagesQueryDto) {
    return this.interactionMessageService.listByInteractionId(query.interactionId, session.organizationId);
  }
}
