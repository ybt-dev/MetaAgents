import Skeleton from '@/components/Skeleton';

const AgentListItemSkeleton = () => {
  return (
    <div className="rounded-lg bg-gray-800 w-48 h-48">
      <div className="flex flex-col items-center justify-center p-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex flex-col items-center mt-4 gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
    </div>
  );
};

export default AgentListItemSkeleton;
