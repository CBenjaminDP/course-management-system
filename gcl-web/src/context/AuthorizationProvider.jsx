import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthorizationProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // Change initial state to undefined
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
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          router.push('/dashboard');
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
            'Content-Type': 'application/json',
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

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthorizationProvider;
