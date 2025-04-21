import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthorizationProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // Change initial state to undefined
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add loading state for logout
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser({
          username: decoded.username,
          rol: decoded.rol,
          ...decoded,
        });
        // Redirect to dashboard if user is authenticated
        if (
          window.location.pathname === "/" ||
          window.location.pathname === "/login"
        ) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [router]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/token/`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { access, refresh } = response.data;
      const decoded = jwtDecode(access);

      Cookies.set("accessToken", access);
      Cookies.set("refreshToken", refresh);

      setUser({
        username: decoded.username,
        rol: decoded.rol,
        ...decoded,
      });

      router.push("/dashboard");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al iniciar sesión"
      );
    }
  };

  const logout = async () => {
    try {
      // Immediately set logging out state to true
      setIsLoggingOut(true);
      
      // Clear cookies with path specified to ensure they're properly removed
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });

      // Clear localStorage if you're using it
      localStorage.removeItem("user");

      // Clear user state
      setUser(null);
      
      // Use a small timeout to ensure the redirect happens after state updates
      setTimeout(() => {
        window.location.href = '/login';
      }, 50);

      // Return a resolved promise to indicate success
      return Promise.resolve();
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false); // Reset loading state on error
      return Promise.reject(error);
    }
  };

  // In your AuthContext provider
  const validateToken = async () => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser({
          username: decoded.username,
          rol: decoded.rol,
          ...decoded,
        });
      } catch (error) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, validateToken, isLoggingOut }}>
      {isLoggingOut && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div>Cerrando sesión...</div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthorizationProvider;
