import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import useSession from '@/hooks/useSession';

export interface NonAuthorizedSectionProps {
  children: ReactNode;
}

const NonAuthorizedSection = ({ children }: NonAuthorizedSectionProps) => {
  const [sessionUser] = useSession();

  if (sessionUser) {
    return <Navigate replace to="/agent-teams" />;
  }

  return <>{children}</>;
};

export default NonAuthorizedSection;
