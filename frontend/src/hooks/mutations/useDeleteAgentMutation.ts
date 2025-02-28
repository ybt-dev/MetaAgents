import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Agent } from '@/api/AgentsApi';
import { useAgentsApi } from '@/providers/ApiProvider';

const useDeleteAgentMutation = () => {
  const agentsApi = useAgentsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(
    async (agent: Agent) => {
      await queryClient.invalidateQueries({ queryKey: ['agents', { teamId: agent.teamId }] });

      toast('Agent was successfully deleted!');
    },
    [queryClient],
  );

  return useMutation<Agent, DefaultError, string>({
    mutationFn: (id) => agentsApi.deleteAgent(id),
    onSuccess: handleMutationSuccess,
  });
};

export default useDeleteAgentMutation;
