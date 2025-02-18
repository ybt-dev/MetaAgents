import { useQuery } from '@tanstack/react-query';
import { useAgentTeamInteractionsApi } from '@/providers/ApiProvider';

const useAgentTeamInteractionByIdQuery = (agentTeamInteractionId: string) => {
  const agentTeamInteractionsApi = useAgentTeamInteractionsApi();

  return useQuery({
    queryKey: ['agent-team-interactions', agentTeamInteractionId],
    queryFn: () => agentTeamInteractionsApi.getAgentTeamInteractionById(agentTeamInteractionId),
  });
};

export default useAgentTeamInteractionByIdQuery;
