import { useQuery } from '@tanstack/react-query';
import { useInteractionMessagesApi } from '@/providers/ApiProvider';

const REFETCH_INTERVAL = 10 * 1000; // 10 seconds in ms

const useListLatestInteractionMessagesQuery = (interactionId: string) => {
  const interactionMessagesApi = useInteractionMessagesApi();

  return useQuery({
    queryKey: ['interaction-messages', { interactionId }],
    queryFn: () => interactionMessagesApi.listLatestForInteraction(interactionId),
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
  });
};

export default useListLatestInteractionMessagesQuery;
