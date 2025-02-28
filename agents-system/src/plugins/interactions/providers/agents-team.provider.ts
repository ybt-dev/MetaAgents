import { IAgentRuntime, Provider } from '@elizaos/core';
import AgentRole from '../../../enums/agent-role.enum.ts';
import { AgentConfigurationsRepository } from '../../../repositories/agent-configurations.repository.ts';
import { AgentsManager } from '../../../managers/agents.manager.ts';

export default class AgentsTeamProvider implements Provider {
  private allowedRolesSet: Set<AgentRole>;

  constructor(
    private agentConfigurationsRepository: AgentConfigurationsRepository,
    private agentsManager: AgentsManager,
    private allowedRoles: AgentRole[],
  ) {
    this.allowedRolesSet = new Set(this.allowedRoles);
  }

  public async get(runtime: IAgentRuntime) {
    const agent = this.agentsManager.getAgent(runtime.character.id);

    if (!agent) {
      throw new Error("Agent doesn't registered in the system.");
    }

    const agentConfigurations = await this.agentConfigurationsRepository.findByOrganizationIdAndTeamId(
      agent.configuration.organizationId,
      agent.configuration.teamId,
    );

    const filteredAgentConfigurations = agentConfigurations.filter((agentConfiguration) => {
      return this.allowedRolesSet.has(agentConfiguration.role) && agentConfiguration.id !== runtime.character.id;
    });

    if (filteredAgentConfigurations.length === 0) {
      return 'Your team has no other agents.';
    }

    const formatBio = (bio) => (Array.isArray(bio) ? bio.join('\n  ') : bio);

    const teamList = filteredAgentConfigurations
      .map((agentConfiguration) => {
        const agent = this.agentsManager.getAgent(agentConfiguration.id);

        if (!agent) {
          return '';
        }

        return `${agentConfiguration.role}:
  id: ${agent.configuration.id}
  Bio: ${formatBio(agent.runtime.character.bio)}`;
      })
      .join('\n\n');

    return `Your team is:\n\n${teamList}`;
  }
}
