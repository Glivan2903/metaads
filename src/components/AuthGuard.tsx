
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if authentication is required but user is not authenticated
        navigate('/login', { state: { from: location.pathname } });
      } else if (!requireAuth && isAuthenticated) {
        // Redirect to dashboard if user is already authenticated and tries to access auth pages
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, loading, navigate, requireAuth, location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  // Allow rendering children only if authentication requirements are met
  if (
    (requireAuth && isAuthenticated) || 
    (!requireAuth && !isAuthenticated)
  ) {
    return <>{children}</>;
  }

  // This will prevent flash of content while redirects are happening
  return null;
};

export default AuthGuard;
