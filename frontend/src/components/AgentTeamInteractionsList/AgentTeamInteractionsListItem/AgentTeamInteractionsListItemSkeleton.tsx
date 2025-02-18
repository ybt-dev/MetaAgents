import Skeleton from '@/components/Skeleton';

const AgentTeamInteractionsListItemSkeleton = () => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
};

export default AgentTeamInteractionsListItemSkeleton;
