import { Plugin } from '@elizaos/core';
import AgentRole from '../../enums/agent-role.enum.ts';
import { AgentsManager } from '../../managers/agents.manager.ts';
import { AgentConfigurationsRepository } from '../../repositories/agent-configurations.repository.ts';
import { AgentTeamInteractionsRepository } from '../../repositories/agent-team-interactions.repository.ts';
import { PublisherFactory } from '../../factories/publisher.factory.ts';
import InteractionsEvaluator from './evaluators/interactions.evaluator.ts';
import AgentsTeamProvider from './providers/agents-team.provider.ts';

export default class InteractionsPlugin implements Plugin {
  public readonly name = 'interactions';
  public readonly description = 'Interactions with other agents and users';
  public readonly actions = [];

  public readonly evaluators: Plugin['evaluators'] = [];
  public readonly providers: Plugin['providers'] = [];

  constructor(
    private agentConfigurationsRepository: AgentConfigurationsRepository,
    private agentTeamInteractionsRepository: AgentTeamInteractionsRepository,
    private agentsManager: AgentsManager,
    private publisherFactory: PublisherFactory,
    private agentRole: AgentRole,
  ) {
    this.evaluators = [
      new InteractionsEvaluator(
        this.agentConfigurationsRepository,
        this.agentTeamInteractionsRepository,
        this.agentsManager,
        this.publisherFactory,
      ),
    ];

    this.providers = [
      new AgentsTeamProvider(
        this.agentConfigurationsRepository,
        this.agentsManager,
        this.agentRole === AgentRole.Producer ? Object.values(AgentRole) : [AgentRole.Producer],
      ),
    ];
  }
}
