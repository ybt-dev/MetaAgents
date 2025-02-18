import { useQuery } from '@tanstack/react-query';
import { useAgentsApi } from '@/providers/ApiProvider';

const useAgentByIdQuery = (agentId: string) => {
  const agentsApi = useAgentsApi();

  return useQuery({
    queryKey: ['agents', agentId],
    queryFn: () => agentsApi.getAgentById(agentId),
  });
};

export default useAgentByIdQuery;
