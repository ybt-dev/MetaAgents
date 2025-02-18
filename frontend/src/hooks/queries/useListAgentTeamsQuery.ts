import { useQuery } from '@tanstack/react-query';
import { useAgentTeamsApi } from '@/providers/ApiProvider';

const useListAgentTeamsQuery = () => {
  const agentTeamsApi = useAgentTeamsApi();

  return useQuery({
    queryKey: ['agent-teams', { latest: true }],
    queryFn: () => agentTeamsApi.listAgentTeams(),
  });
};

export default useListAgentTeamsQuery;
