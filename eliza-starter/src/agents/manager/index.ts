import { AgentRuntime as ElizaAgentRuntime, Character as ElizaCharacter } from "@elizaos/core";

export interface AiOfficeAgentRuntime extends ElizaAgentRuntime {
  character: AiOfficeCharacter;
}

export interface AiOfficeCharacter extends ElizaCharacter {
  organizationId: string;
  teamId: string;
  role: string;
}

class AgentManager {
  private rolesIndex: Map<string, string> = new Map();
  private agentsMap: Map<string, AiOfficeAgentRuntime> = new Map();

  public addAgent(id, agent) {
    if (!this.agentsMap.has(id)) {
      this.agentsMap.set(id, agent);
      this.rolesIndex.set(this.generateRolesIndex(agent.character.organizationId, agent.character.role), id);

      console.log(`Agent ${id} added.`);
    } else {
      console.log(`Agent ${id} already exists.`);
    }
  }

  public removeAgent(id) {
    const agent = this.getAgent(id);

    if (!agent) {
      return;
    }

    this.rolesIndex.delete(this.generateRolesIndex(agent.character.organizationId, agent.character.role));

    this.agentsMap.delete(id);
  }

  public getAgent(id) {
    return this.agentsMap.get(id);
  }

  public getAgentByRole(organizationId: string, role: string) {
    const rolesIndexKey = this.generateRolesIndex(organizationId, role);
    const agentId = this.rolesIndex.get(rolesIndexKey);

    if (!agentId) {
      return undefined;
    }

    return this.getAgent(agentId);
  }

  public hasAgent(id) {
    return this.agentsMap.has(id);
  }

  public getAllAgents() {
    return Array.from(this.agentsMap.values());
  }

  public async performTask(id, taskFunction) {
    const agent = this.getAgent(id);

    if (!agent) {
      throw new Error(`Agent ${name} not found.`);
    }

    try {
      return await taskFunction(agent);
    } catch (error) {
      console.error(`Error performing task with agent ${id}:`, error);

      throw error;
    }
  }

  private generateRolesIndex(organizationId: string, role: string) {
    return `${organizationId}-${role}`;
  }
}

const agentsManager = new AgentManager();

export {
  agentsManager,
  AgentManager
};
