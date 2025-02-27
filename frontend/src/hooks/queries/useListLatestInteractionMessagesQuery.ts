import { useQuery } from '@tanstack/react-query';
import { useInteractionMessagesApi } from '@/providers/ApiProvider';

const useListLatestInteractionMessagesQuery = (interactionId: string) => {
  const interactionMessagesApi = useInteractionMessagesApi();

  return useQuery({
    queryKey: ['interaction-messages', { interactionId }],
    queryFn: () => interactionMessagesApi.listLatestForInteraction(interactionId),
  });
};

export default useListLatestInteractionMessagesQuery;
