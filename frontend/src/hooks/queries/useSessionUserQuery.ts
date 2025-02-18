import { useQuery } from '@tanstack/react-query';
import { useSessionsApi } from '@/providers/ApiProvider';

const useSessionUserQuery = () => {
  const sessionsApi = useSessionsApi();

  return useQuery({
    queryKey: ['session-user'],
    retry: false,
    queryFn: () => sessionsApi.getSessionUser(),
  });
};

export default useSessionUserQuery;
