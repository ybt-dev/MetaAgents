import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionsApi } from '@/providers/ApiProvider';

const useLogoutMutation = () => {
  const sessionsApi = useSessionsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(() => {
    queryClient.setQueriesData({ queryKey: ['session-user'] }, null);
  }, [queryClient]);

  return useMutation<void, DefaultError, void>({
    mutationFn: () => sessionsApi.deleteSession(),
    onSuccess: handleMutationSuccess,
  });
};

export default useLogoutMutation;
