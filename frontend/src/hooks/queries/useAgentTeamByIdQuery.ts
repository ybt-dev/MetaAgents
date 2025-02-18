import { useQuery } from '@tanstack/react-query';
import { useAgentTeamsApi } from '@/providers/ApiProvider';

const useAgentTeamByIdQuery = (agentTeamId: string) => {
  const agentTeamsApi = useAgentTeamsApi();

  return useQuery({
    queryKey: ['agent-teams', agentTeamId],
    queryFn: () => agentTeamsApi.getAgentTeamById(agentTeamId),
  });
};

export default useAgentTeamByIdQuery;
