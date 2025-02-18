import { useQuery } from '@tanstack/react-query';
import { useAgentMessagesApi } from '@/providers/ApiProvider';

const useListLatestAgentMessagesQuery = (interactionId: string) => {
  const agentMessagesApi = useAgentMessagesApi();

  return useQuery({
    queryKey: ['agent-messages', { interactionId }],
    queryFn: () => agentMessagesApi.listLatestForInteraction(interactionId),
  });
};

export default useListLatestAgentMessagesQuery;
