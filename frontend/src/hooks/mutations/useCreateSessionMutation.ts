import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSessionParams } from '@/api/SessionsApi';
import { useSessionsApi } from '@/providers/ApiProvider';

const useCreateSessionMutation = () => {
  const sessionsApi = useSessionsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['session-user'] });
  }, [queryClient]);

  return useMutation<void, DefaultError, CreateSessionParams>({
    mutationFn: (params) => sessionsApi.createSession(params),
    onSuccess: handleMutationSuccess,
  });
};

export default useCreateSessionMutation;
