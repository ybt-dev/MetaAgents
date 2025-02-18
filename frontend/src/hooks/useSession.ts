import { useContext } from 'react';
import { SessionContext } from '@/providers/SessionProvider';

const useSession = () => {
  const sessionValue = useContext(SessionContext);

  if (!sessionValue) {
    throw new Error('Session value is not provided.');
  }

  return [sessionValue.sessionUser, sessionValue.refetch] as const;
};

export default useSession;
