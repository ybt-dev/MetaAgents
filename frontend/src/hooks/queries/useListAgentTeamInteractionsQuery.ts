import { useQuery } from '@tanstack/react-query';
import { useAgentTeamInteractionsApi } from '@/providers/ApiProvider';

const useListAgentTeamInteractionsQuery = (teamId: string) => {
  const agentTeamInteractionsApi = useAgentTeamInteractionsApi();

  return useQuery({
    queryKey: ['agent-team-interactions', { teamId }],
    queryFn: () => agentTeamInteractionsApi.listForTeam(teamId),
  });
};

export default useListAgentTeamInteractionsQuery;
