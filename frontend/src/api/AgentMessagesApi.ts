import { ApiClient } from './ApiClient';

export interface AgentMessage {
  id: string;
  interactionId: string;
  teamId: string;
  organizationId: string;
  sourceAgentId: string;
  targetAgentId: string;
  content: string;
  createdAt: Date | string;
}

export interface AgentMessagesApi {
  listLatestForInteraction(interactionId: string): Promise<AgentMessage[]>;
}

export default class AgentMessagesRestApi implements AgentMessagesApi {
  public constructor(private client: ApiClient) {}

  public async listLatestForInteraction(interactionId: string) {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set('interactionId', interactionId);

    return this.client.makeCall<AgentMessage[]>(`/agent-messages?${urlSearchParams}`);
  }
}
