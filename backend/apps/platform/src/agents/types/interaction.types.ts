import { InteractionMessageActorType } from '@apps/platform/agents/enums';

export interface InteractionMessageActor {
  id: string;
  type: InteractionMessageActorType;
}
