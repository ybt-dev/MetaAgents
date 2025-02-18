import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { AgentTeamInteraction, CreateAgentTeamInteraction } from '@/api/AgentTeamInteractionsApi.ts';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAgentTeamInteractionsApi } from '@/providers/ApiProvider';

const useCreateAgentTeamInteractionMutation = () => {
  const agentTeamInteractionsApi = useAgentTeamInteractionsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(
    async (agentTeamInteraction: AgentTeamInteraction) => {
      await queryClient.invalidateQueries({
        queryKey: ['agent-team-interactions', { teamId: agentTeamInteraction.teamId }],
      });

      toast('Your request to the team was sent successfully!');
    },
    [queryClient],
  );

  return useMutation<AgentTeamInteraction, DefaultError, CreateAgentTeamInteraction>({
    mutationFn: (params) => agentTeamInteractionsApi.createAgentTeamInteraction(params),
    onSuccess: handleMutationSuccess,
  });
};

export default useCreateAgentTeamInteractionMutation;
