import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Agent, UpdateAgentParams } from '@/api/AgentsApi';
import { useAgentsApi } from '@/providers/ApiProvider';

const useUpdateAgentMutation = () => {
  const agentsApi = useAgentsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(
    async (agent: Agent) => {
      await queryClient.invalidateQueries({ queryKey: ['agents', { teamId: agent.teamId }] });
      await queryClient.invalidateQueries({ queryKey: ['agents', agent.id] });

      toast('Agent was updated successfully!');
    },
    [queryClient],
  );

  return useMutation<Agent, DefaultError, UpdateAgentParams & { id: string }>({
    mutationFn: ({ id, ...restParams }) => agentsApi.updateAgent(id, restParams),
    onSuccess: handleMutationSuccess,
  });
};

export default useUpdateAgentMutation;
