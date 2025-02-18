import { useQueryParams } from '@/hooks/useQueryParams';

const useQueryParam = (key: string): string | null => {
  const params = useQueryParams();

  return params.get(key);
};

export default useQueryParam;
