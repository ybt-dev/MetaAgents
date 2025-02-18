import { useQuery } from '@tanstack/react-query';
import { useAgentsApi } from '@/providers/ApiProvider';

const useListAgentsByTeamIdQuery = (teamId: string) => {
  const agentTeamsApi = useAgentsApi();

  return useQuery({
    queryKey: ['agents', { teamId }],
    queryFn: () => agentTeamsApi.listTeamAgents(teamId),
  });
};

export default useListAgentsByTeamIdQuery;
