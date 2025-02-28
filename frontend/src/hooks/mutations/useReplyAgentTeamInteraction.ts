import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentTeamInteraction } from '@/api/AgentTeamInteractionsApi';
import { useAgentTeamInteractionsApi } from '@/providers/ApiProvider';

const useReplyAgentTeamInteraction = () => {
  const agentTeamInteractionsApi = useAgentTeamInteractionsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(
    async (agentTeamInteraction: AgentTeamInteraction) => {
      await queryClient.invalidateQueries({ queryKey: ['agent-team-interactions', agentTeamInteraction.id] });

      toast('Your request to the team was sent successfully!');
    },
    [queryClient],
  );

  return useMutation<AgentTeamInteraction, DefaultError, { id: string; content: string }>({
    mutationFn: (params) => {
      return agentTeamInteractionsApi.replyToAgentTeamInteraction(params.id, params.content);
    },
    onSuccess: handleMutationSuccess,
  });
};

export default useReplyAgentTeamInteraction;
