import Skeleton from '@/components/Skeleton';

const InteractionMessagesListItemSkeleton = () => {
  return (
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};

export default InteractionMessagesListItemSkeleton;
