import { AgentConfiguration, Consumer, Event } from '../types';
import ConsumerName from '../enums/consumer-name.enum.ts';
import AgentEventType from '../enums/agent-event-type.enum.ts';
import { AgentsManager } from '../managers/agents.manager.ts';
import { ConsumerFactory } from '../factories/consumer.factory.ts';
import { CharacterFactory } from '../factories/character.factory.ts';

export type AgentsControlEvent = Event<
  AgentEventType,
  {
    object: AgentConfiguration;
  }
>;

export interface AgentsControlService {
  start(): Promise<void>;
}

export class DefaultAgentsControlService implements AgentsControlService {
  private consumer: Consumer;

  constructor(
    private consumerFactory: ConsumerFactory,
    private characterFactory: CharacterFactory,
    private agentsManager: AgentsManager,
  ) {
    this.consumer = this.consumerFactory.createConsumer(ConsumerName.AgentsControl, (message) =>
      this.handleAgentsControlEvent(message.payload as AgentsControlEvent),
    );
  }

  public async start() {
    await this.consumer.start();
  }

  private async handleAgentsControlEvent(event: AgentsControlEvent) {
    const { object: agentConfiguration } = event.data;

    switch (event.type) {
      case AgentEventType.AgentCreated: {
        await this.agentsManager.startAgent(
          this.characterFactory.createCharacter(agentConfiguration),
          agentConfiguration,
        );

        return;
      }
      case AgentEventType.AgentUpdated: {
        await this.agentsManager.stopAgent(agentConfiguration.id);

        await this.agentsManager.startAgent(
          this.characterFactory.createCharacter(agentConfiguration),
          agentConfiguration,
        );

        return;
      }
      case AgentEventType.AgentDeleted: {
        await this.agentsManager.stopAgent(agentConfiguration.id);

        return;
      }
      default: {
        throw new Error(`Unknown event type: ${event.type}`);
      }
    }
  }
}
