import Skeleton from '@/components/Skeleton';

const AgentTeamCardSkeleton = () => {
  return (
    <div className="rounded-lg bg-gray-800/50 p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
};

export default AgentTeamCardSkeleton;
