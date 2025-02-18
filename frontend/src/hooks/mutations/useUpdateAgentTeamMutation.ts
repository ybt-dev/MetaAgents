import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AgentTeam, UpdateAgentTeamParams } from '@/api/AgentTeamsApi';
import { useAgentTeamsApi } from '@/providers/ApiProvider';

const useUpdateAgentTeamMutation = () => {
  const agentTeamsApi = useAgentTeamsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(
    async (agentTeam: AgentTeam) => {
      await queryClient.invalidateQueries({ queryKey: ['agent-teams', { latest: true }] });
      await queryClient.invalidateQueries({ queryKey: ['agent-teams', agentTeam.id] });

      toast('Agent Team was updated successfully!');
    },
    [queryClient],
  );

  return useMutation<AgentTeam, DefaultError, UpdateAgentTeamParams & { id: string }>({
    mutationFn: ({ id, ...restParams }) => agentTeamsApi.updateAgentTeam(id, restParams),
    onSuccess: handleMutationSuccess,
  });
};

export default useUpdateAgentTeamMutation;
