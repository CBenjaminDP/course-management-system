import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './AuthorizationProvider';

const AuthGuard = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si el usuario está definido (ya se verificó su estado)
    if (user !== undefined) {
      // Si el usuario no está autenticado y no estamos en login o index
      if (user === null && !['/login', '/'].includes(window.location.pathname)) {
        router.push('/login');
      }
      // Si el usuario está autenticado y estamos en login
      if (user && window.location.pathname === '/login') {
        router.push('/');
      }
    }
  }, [user]);

  // Mostrar los children solo si el usuario está autenticado o estamos en la página de login
  return children;
};

export default AuthGuard;