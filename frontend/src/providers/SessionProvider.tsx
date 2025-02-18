import { createContext, useMemo, ReactNode } from 'react';
import { User } from '@/api/UsersApi';

export interface SessionProviderProps {
  children: ReactNode;
  sessionUser: User | null;
  refetch: () => void;
}

export interface SessionValue {
  sessionUser: User | null | undefined;
  refetch: () => void;
}

export const SessionContext = createContext<SessionValue>({} as SessionValue);

export const SessionProvider = ({ children, sessionUser, refetch }: SessionProviderProps) => {
  const session = useMemo(() => {
    return { sessionUser, refetch };
  }, [sessionUser, refetch]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};
