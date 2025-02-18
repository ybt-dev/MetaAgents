import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Session } from '@apps/platform/sessions/decorators';
import { SessionData } from '@apps/platform/sessions/types';
import { SessionGuard } from '@apps/platform/sessions/guards';
import { AgentTeamService } from '@apps/platform/agents/services';
import { InjectAgentTeamService } from '@apps/platform/agents/decorators';
import { CreateAgentTeamBodyDto, UpdateAgentTeamBodyDto } from '@apps/platform/agents/dto';

@Controller('/agent-teams')
@UseGuards(SessionGuard)
export default class AgentTeamController {
  constructor(@InjectAgentTeamService() private readonly agentTeamService: AgentTeamService) {}

  @Get('/')
  public listAgentTeams(@Session() session: SessionData) {
    return this.agentTeamService.list(session.organizationId);
  }

  @Get('/:id')
  public getAgentTeamById(@Session() session: SessionData, @Param('id') id: string) {
    return this.agentTeamService.getIfExist(id, session.organizationId);
  }

  @Post('/')
  public createTeam(@Session() session: SessionData, @Body() body: CreateAgentTeamBodyDto) {
    return this.agentTeamService.create({
      name: body.name,
      strategy: body.strategy,
      description: body.description,
      createdById: session.userId,
      organizationId: session.organizationId,
    });
  }

  @Put('/:id')
  public updateTeam(@Session() session: SessionData, @Param('id') id: string, @Body() body: UpdateAgentTeamBodyDto) {
    return this.agentTeamService.update(id, session.organizationId, {
      name: body.name,
      strategy: body.strategy,
      description: body.description,
      updatedById: session.userId,
    });
  }
}
