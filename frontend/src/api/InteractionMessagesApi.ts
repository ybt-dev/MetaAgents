import InteractionMessageActorType from '@/enums/InteractionMessageActorType';
import { ApiClient } from './ApiClient';

export interface InteractionMessageActor {
  id: string;
  type: InteractionMessageActorType;
}

export interface InteractionMessage {
  id: string;
  teamId: string;
  interactionId: string;
  sourceActor: InteractionMessageActor;
  repliedToMessageId?: string;
  organizationId: string;
  content: string;
  createdAt: Date;
}

export interface InteractionMessagesApi {
  listLatestForInteraction(interactionId: string): Promise<InteractionMessage[]>;
}

export default class AgentMessagesRestApi implements InteractionMessagesApi {
  public constructor(private client: ApiClient) {}

  public async listLatestForInteraction(interactionId: string) {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set('interactionId', interactionId);

    return this.client.makeCall<InteractionMessage[]>(`/interaction-messages?${urlSearchParams}`);
  }
}
