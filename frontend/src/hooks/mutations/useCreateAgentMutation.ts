import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Agent, CreateAgentParams } from '@/api/AgentsApi';
import { useAgentsApi } from '@/providers/ApiProvider';

const useCreateAgentMutation = () => {
  const agentsApi = useAgentsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(
    async (agent: Agent) => {
      await queryClient.invalidateQueries({ queryKey: ['agents', { teamId: agent.teamId }] });

      toast('Agent was created successfully!');
    },
    [queryClient],
  );

  return useMutation<Agent, DefaultError, CreateAgentParams>({
    mutationFn: (params) => agentsApi.createAgent(params),
    onSuccess: handleMutationSuccess,
  });
};

export default useCreateAgentMutation;
