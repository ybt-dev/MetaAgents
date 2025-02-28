import { AgentRuntime } from '@elizaos/core';
import { AgentConfiguration } from '../types';

export interface Agent {
  configuration: AgentConfiguration;
  runtime: AgentRuntime;
}

export interface AgentsStore {
  addAgent(id: string, agent: Agent): void;
  removeAgent(id: string): void;
  getAgent(id: string): Agent | undefined;
  hasAgent(id: string): boolean;
  getAllAgents(): Agent[];
}

export class DefaultAgentsStore implements AgentsStore {
  private agentsMap: Map<string, Agent> = new Map();

  public addAgent(id, agent: Agent) {
    if (!this.agentsMap.has(id)) {
      this.agentsMap.set(id, agent);
    }
  }

  public removeAgent(id: string) {
    const agent = this.getAgent(id);

    if (!agent) {
      return;
    }

    this.agentsMap.delete(id);
  }

  public getAgent(id: string) {
    return this.agentsMap.get(id);
  }

  public hasAgent(id: string) {
    return this.agentsMap.has(id);
  }

  public getAllAgents() {
    return Array.from(this.agentsMap.values());
  }
}
