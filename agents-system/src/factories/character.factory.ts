import { Character } from '@elizaos/core';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';
import { createNodePlugin } from '@elizaos/plugin-node';
import { AgentConfiguration } from '../types';
import AgentRole from '../enums/agent-role.enum.ts';
import { InitiaApi } from '../api/initia.api.ts';
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
  [key in AgentRole]: (
    agentConfiguration: AgentConfiguration,
    encryptionHelper: EncryptionHelper,
    initiaApi: InitiaApi,
  ) => Character;
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
    private initialApi: InitiaApi,
    private templatesMapping: TemplatesMapping,
  ) {}

  public createCharacter(agentConfiguration: AgentConfiguration): Character {
    const characterTemplate = this.templatesMapping[agentConfiguration.role];

    if (!characterTemplate) {
      throw new Error(`Character generator for ${agentConfiguration.role} not found.`);
    }

    const character = characterTemplate(agentConfiguration, this.encryptionHelper, this.initialApi);

    return {
      ...character,
      plugins: [
        ...character.plugins,
        bootstrapPlugin,
        createNodePlugin(),
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
