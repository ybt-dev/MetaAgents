import { ApiClient } from './ApiClient';

export interface AgentTeamInteraction {
  id: string;
  title: string;
  requestContent: string;
  organizationId: string;
  teamId: string;
  createdById?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateAgentTeamInteraction {
  title: string;
  requestContent: string;
  teamId: string;
}

export interface AgentTeamInteractionsApi {
  listForTeam(teamId: string): Promise<AgentTeamInteraction[]>;
  getAgentTeamInteractionById(id: string): Promise<AgentTeamInteraction>;
  createAgentTeamInteraction(params: CreateAgentTeamInteraction): Promise<AgentTeamInteraction>;
}

export default class AgentConversationsRestApi implements AgentTeamInteractionsApi {
  public constructor(private client: ApiClient) {}

  public listForTeam(teamId: string) {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set('teamId', teamId);

    return this.client.makeCall<AgentTeamInteraction[]>(`/agent-team-interactions?${urlSearchParams}`);
  }

  public getAgentTeamInteractionById(id: string) {
    return this.client.makeCall<AgentTeamInteraction>(`/agent-team-interactions/${id}`);
  }

  public createAgentTeamInteraction(params: CreateAgentTeamInteraction) {
    return this.client.makeCall<AgentTeamInteraction>('/agent-team-interactions', 'POST', params);
  }
}
