import {
  AgentRuntime,
  CacheManager,
  Character,
  Clients,
  DbCacheAdapter,
  elizaLogger,
  IAgentRuntime,
  IDatabaseAdapter,
  IDatabaseCacheAdapter,
  ModelProviderName,
} from '@elizaos/core';
import TwitterClientInterface from '@elizaos/client-twitter';
import { AgentConfiguration } from '../types';
import { Agent, AgentsStore } from '../stores/agents.store.ts';

export interface AgentsManager {
  startAgent(character: Character, configuration: AgentConfiguration): Promise<Agent>;
  getAgent(agentId: string): Agent | undefined;
  stopAgent(agentId: string): Promise<void>;
}

export class DefaultAgentsManager implements AgentsManager {
  constructor(
    private agentsStore: AgentsStore,
    private databaseAdapter: IDatabaseAdapter,
    private databaseCacheAdapter: IDatabaseCacheAdapter,
  ) {}

  public async startAgent(character: Character, agentConfiguration: AgentConfiguration) {
    try {
      elizaLogger.info(`Starting Agent: ${agentConfiguration.id}`);

      const token = this.getTokenForProvider(character.modelProvider, character);

      const cache = new CacheManager(new DbCacheAdapter(this.databaseCacheAdapter, character.id));

      const runtime = new AgentRuntime({
        character,
        token,
        databaseAdapter: this.databaseAdapter,
        modelProvider: character.modelProvider,
        cacheManager: cache,
      });

      const agent = { runtime, configuration: agentConfiguration };

      this.agentsStore.addAgent(runtime.agentId, agent);

      await runtime.initialize();

      const cookies = runtime.getSetting('TWITTER_COOKIES');
      const username = runtime.getSetting('TWITTER_USERNAME');

      if (cookies) {
        elizaLogger.log(`Reading cookies from SETTINGS...`);

        await runtime.cacheManager.set(`twitter/${username}/cookies`, JSON.parse(cookies));
      }

      await this.initializeAgentClients(character, runtime);

      return agent;
    } catch (error) {
      elizaLogger.error(`Error starting agent for character ${character.name}:`, error);

      throw error;
    }
  }

  public getAgent(agentId: string) {
    return this.agentsStore.getAgent(agentId);
  }

  public async stopAgent(agentId: string): Promise<void> {
    try {
      elizaLogger.info(`Stopping Agent: ${agentId}`);

      const agent = this.agentsStore.getAgent(agentId);

      if (!agent) {
        return;
      }

      await agent.runtime.stop();

      this.agentsStore.removeAgent(agentId);

      elizaLogger.success(`Agent stopped: ${agentId}`);
    } catch (error) {
      elizaLogger.error(`Failed to stop agent: ${agentId}`);
    }
  }

  private async initializeAgentClients(character: Character, runtime: IAgentRuntime) {
    const characterClientTypes = character.clients || [];

    for (const characterClientType of characterClientTypes) {
      switch (characterClientType) {
        case Clients.TWITTER: {
          await TwitterClientInterface.start(runtime);

          break;
        }
      }
    }
  }

  private getTokenForProvider(provider: ModelProviderName, character: Character) {
    switch (provider) {
      case ModelProviderName.OPENAI: {
        return character.settings?.secrets?.OPENAI_API_KEY;
      }
      case ModelProviderName.OPENROUTER: {
        return character.settings?.secrets?.OPENROUTER;
      }
    }
  }
}
