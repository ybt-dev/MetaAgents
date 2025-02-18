import { AgentTeam } from '@/api/AgentTeamsApi';
import AgentTeamCard, { AgentTeamCardSkeleton } from '@/components/AgentTeamCard';

export interface AgentTeamsListProps {
  agentTeams: AgentTeam[] | null;
  onEditAgentTeamClick: (agentTeam: AgentTeam) => void;
}

const SKELETON_COUNT = 6;

const AgentTeamsGrid = ({ agentTeams, onEditAgentTeamClick }: AgentTeamsListProps) => {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {agentTeams === null &&
        Array.from({ length: SKELETON_COUNT }).map((_, index) => {
          return <AgentTeamCardSkeleton key={index} />;
        })}
      {agentTeams &&
        agentTeams.map((team) => (
          <AgentTeamCard
            key={team.id}
            name={team.name}
            description={team.description}
            onEditButtonClick={() => onEditAgentTeamClick(team)}
          />
        ))}
    </div>
  );
};

export default AgentTeamsGrid;
