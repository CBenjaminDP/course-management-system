import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './AuthorizationProvider';

const AuthGuard = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined) {
      if (user === null && !['/login', '/'].includes(window.location.pathname)) {
        router.push('/login');
      }
      // If user is authenticated and in login or root path, redirect to dashboard
      if (user && ['/login', '/'].includes(window.location.pathname)) {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  return children;
};

export default AuthGuard;