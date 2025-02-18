import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { AgentTeam, CreateAgentTeamParams } from '@/api/AgentTeamsApi';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAgentTeamsApi } from '@/providers/ApiProvider';

const useCreateAgentTeamMutation = () => {
  const agentTeamsApi = useAgentTeamsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['agent-teams', { latest: true }] });

    toast('Agent team was created successfully!');
  }, [queryClient]);

  return useMutation<AgentTeam, DefaultError, CreateAgentTeamParams>({
    mutationFn: (params) => agentTeamsApi.createAgentTeam(params),
    onSuccess: handleMutationSuccess,
  });
};

export default useCreateAgentTeamMutation;
