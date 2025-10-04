import { useAuth } from '@/services/auth/me';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const hasToken = localStorage.getItem('access_token');
  const { data: user, isLoading } = useAuth({
    enabled: !!hasToken, 
  });

  if (hasToken && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (hasToken && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
