import { Character } from '@elizaos/core';
import { AgentConfiguration } from '../types';
import AgentRole from '../enums/agent-role.enum.ts';
import { EncryptionHelper } from '../helpers/encryption.helper.ts';
import { AgentConfigurationsRepository } from '../repositories/agent-configurations.repository.ts';
import { AgentTeamInteractionsRepository } from '../repositories/agent-team-interactions.repository.ts';
import { AgentsManager } from '../managers/agents.manager.ts';
import { PublisherFactory } from './publisher.factory.ts';
import InteractionsPlugin from '../plugins/interactions/interactions.plugin.ts';

export interface CharacterFactory {
  createCharacter: (agentConfiguration: AgentConfiguration) => Character;
}

export type TemplatesMapping = {
  [key in AgentRole]: (encryptionHelper: EncryptionHelper, agentConfiguration: AgentConfiguration) => Character;
};

export interface CharacterFactory {
  createCharacter: (agentConfiguration: AgentConfiguration) => Character;
}

export class DefaultCharacterFactory implements CharacterFactory {
  constructor(
    private agentConfigurationsRepository: AgentConfigurationsRepository,
    private agentTeamInteractionsRepository: AgentTeamInteractionsRepository,
    private agentsManager: AgentsManager,
    private publisherFactory: PublisherFactory,
    private encryptionHelper: EncryptionHelper,
    private templatesMapping: TemplatesMapping,
  ) {}

  public createCharacter(agentConfiguration: AgentConfiguration): Character {
    const characterTemplate = this.templatesMapping[agentConfiguration.role];

    if (!characterTemplate) {
      throw new Error(`Character generator for ${agentConfiguration.role} not found.`);
    }

    const character = characterTemplate(this.encryptionHelper, agentConfiguration);

    return {
      ...character,
      plugins: [
        ...character.plugins,
        new InteractionsPlugin(
          this.agentConfigurationsRepository,
          this.agentTeamInteractionsRepository,
          this.agentsManager,
          this.publisherFactory,
          agentConfiguration.role,
        ),
      ],
    };
  }
}
