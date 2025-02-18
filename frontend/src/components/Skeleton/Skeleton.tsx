import { tailwindClsx } from '@/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

const Skeleton = ({ className, width, height, circle = false }: SkeletonProps) => {
  return (
    <div
      className={tailwindClsx(
        'animate-pulse bg-gray-700/50',
        circle && 'rounded-full',
        !circle && 'rounded-md',
        className,
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

export default Skeleton;
