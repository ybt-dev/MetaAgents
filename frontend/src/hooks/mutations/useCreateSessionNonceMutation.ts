import { DefaultError, useMutation } from '@tanstack/react-query';
import { useSessionsApi } from '@/providers/ApiProvider';

const useCreateSessionNonceMutation = () => {
  const sessionsApi = useSessionsApi();

  return useMutation<string, DefaultError, string>({
    mutationFn: (address) => sessionsApi.createSessionNonce(address),
  });
};

export default useCreateSessionNonceMutation;
