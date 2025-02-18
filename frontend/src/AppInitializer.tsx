import { ReactNode } from 'react';
import { SessionProvider } from '@/providers/SessionProvider';
import useSessionUserQuery from '@/hooks/queries/useSessionUserQuery';
import LoadingScreen from '@/components/LoadingScreen';
import SignIn from '@/components/SignIn';

export interface AppInitializerProps {
  children: ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const { data: sessionUser, refetch: refetchSessionUser, isLoading: isSessionLoading } = useSessionUserQuery();

  if (isSessionLoading) {
    return <LoadingScreen />;
  }

  return (
    <SessionProvider sessionUser={sessionUser ?? null} refetch={refetchSessionUser}>
      <SignIn />
      {children}
    </SessionProvider>
  );
};

export default AppInitializer;
