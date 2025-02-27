import { InteractionMessage, InteractionMessageActor } from '@/api/InteractionMessagesApi.ts';
import { Agent } from '@/api/AgentsApi';
import InteractionMessageActorType from '@/enums/InteractionMessageActorType.ts';
import { getImagePlaceholderByRole } from '@/components/AgentsList/AgentListItem/AgentListItem.tsx';
import InteractionMessagesListItem, { InteractionMessagesListItemSkeleton } from './InteractionMessagesListItem';

export interface InteractionMessagesListProps {
  agentsPool: Record<string, Agent>;
  messages: InteractionMessage[] | null;
}

const SKELETON_MESSAGES_COUNT = 4;

const InteractionMessagesList = ({ messages, agentsPool }: InteractionMessagesListProps) => {
  const getSenderInformation = (sourceActor: InteractionMessageActor) => {
    if (sourceActor.type === InteractionMessageActorType.User) {
      return {
        name: 'User',
        imageUrl: '/avatar-mini.png',
      };
    }

    const senderAgent = agentsPool[sourceActor.id];

    return {
      name: senderAgent?.name ?? 'Unknown',
      imageUrl: senderAgent?.imageUrl || (senderAgent?.role && getImagePlaceholderByRole(senderAgent.role)) || '',
    };
  };

  return (
    <div className="space-y-6">
      {!!agentsPool &&
        messages?.map((message) => {
          const { name, imageUrl } = getSenderInformation(message.sourceActor);

          return (
            <InteractionMessagesListItem
              key={message.id}
              messageId={message.id}
              senderName={name}
              senderAvatarUrl={imageUrl}
              messageContent={message.content}
              messageDate={message.createdAt}
            />
          );
        })}
      {(!messages || !agentsPool) &&
        Array.from({ length: SKELETON_MESSAGES_COUNT }).map((_, index) => (
          <InteractionMessagesListItemSkeleton key={index} />
        ))}
    </div>
  );
};

export default InteractionMessagesList;
