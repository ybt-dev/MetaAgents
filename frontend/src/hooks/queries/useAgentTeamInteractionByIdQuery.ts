import { useQuery } from '@tanstack/react-query';
import { useAgentTeamInteractionsApi } from '@/providers/ApiProvider';

const REFETCH_INTERVAL = 1000 * 20; // 20 seconds in ms

const useAgentTeamInteractionByIdQuery = (agentTeamInteractionId: string) => {
  const agentTeamInteractionsApi = useAgentTeamInteractionsApi();

  return useQuery({
    queryKey: ['agent-team-interactions', agentTeamInteractionId],
    queryFn: () => agentTeamInteractionsApi.getAgentTeamInteractionById(agentTeamInteractionId),
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
  });
};

export default useAgentTeamInteractionByIdQuery;
