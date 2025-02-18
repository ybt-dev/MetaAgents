import { Agent } from '@/api/AgentsApi';
import AgentListItem, { AgentListItemSkeleton } from './AgentListItem';

export interface AgentListProps {
  agents: Agent[] | null;
  selectedAgentId: string | null;
  onAgentClick: (agent: Agent) => void;
}

const SKELETON_AGENTS_COUNT = 3;

const AgentsList = ({ selectedAgentId, agents, onAgentClick }: AgentListProps) => {
  return (
    <div className="flex gap-5 shrink-0">
      {!agents &&
        Array.from({ length: SKELETON_AGENTS_COUNT }).map((_, index) => <AgentListItemSkeleton key={index} />)}
      {agents?.map((agent) => {
        const isSelected = agent.id === selectedAgentId;

        return (
          <AgentListItem
            key={agent.id}
            name={agent.name}
            role={agent.role}
            imageSrc={agent.imageUrl}
            onClick={() => onAgentClick(agent)}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
};

export default AgentsList;
