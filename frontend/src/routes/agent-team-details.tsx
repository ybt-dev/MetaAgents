import { Navigate, Outlet, useNavigate, useParams } from 'react-router';
import { useMatch } from 'react-router';
import TeamCategoryId from '@/enums/TeamCategoryId';
import useAgentTeamByIdQuery from '@/hooks/queries/useAgentTeamByIdQuery';
import TeamManagementPanel from '@/components/TeamManagementPanel';

const AgentTeamDetails = () => {
  const { agentTeamId } = useParams<{ agentTeamId: string; category: TeamCategoryId }>();

  const navigate = useNavigate();

  const { data: currentAgentTeam } = useAgentTeamByIdQuery(agentTeamId || '');

  const handleSelectCategory = (categoryId: TeamCategoryId) => {
    navigate(`/agent-teams/${agentTeamId}/${categoryId}`);
  };

  const { params: { category } = {} } = useMatch('/agent-teams/:teamId/:category/*') || {};

  if (!category) {
    return <Navigate to={`/agent-teams/${agentTeamId}/${TeamCategoryId.Agents}`} />;
  }

  return (
    <div className="flex flex-grow h-full">
      <TeamManagementPanel
        selectedCategoryId={category as TeamCategoryId}
        agentTeamName={currentAgentTeam?.name || ''}
        onSelectCategory={handleSelectCategory}
        goBackButtonLink="/agent-teams"
      />
      <div className="relative flex-grow p-6 overflow-auto">
        <Outlet context={agentTeamId} />
      </div>
    </div>
  );
};

export default AgentTeamDetails;
