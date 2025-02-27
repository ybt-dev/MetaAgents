import { AgentTeamInteraction } from '@/api/AgentTeamInteractionsApi.ts';
import AgentTeamInteractionsListItem, { AgentTeamInteractionsListItemSkeleton } from './AgentTeamInteractionsListItem';

export interface AgentTeamInteractionsListProps {
  interactions: AgentTeamInteraction[] | null;
  getAgentTeamInteractionsLink: (interactionId: string) => string;
}

const SKELETON_LIST_ITEMS_COUNT = 3;

const AgentTeamInteractionsList = ({ interactions, getAgentTeamInteractionsLink }: AgentTeamInteractionsListProps) => {
  return (
    <div className="flex flex-col space-y-4">
      {!interactions
        ? Array.from({ length: SKELETON_LIST_ITEMS_COUNT }).map((_, index) => (
            <AgentTeamInteractionsListItemSkeleton key={index} />
          ))
        : interactions.map((interaction) => (
            <AgentTeamInteractionsListItem
              interactionId={interaction.id}
              key={interaction.id}
              title={interaction.title}
              requestContent={interaction.requestContent}
              date={interaction.createdAt}
              getAgentTeamInteractionsLink={getAgentTeamInteractionsLink}
            />
          ))}
    </div>
  );
};

export default AgentTeamInteractionsList;
