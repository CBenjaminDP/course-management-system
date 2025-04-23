import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

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

      Swal.fire({
        title: "¡Éxito!",
        text: "Inicio de sesión exitoso",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/dashboard");
      return response.data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.detail || "Error al iniciar sesión",
        icon: "error",
      });
      throw new Error(
        error.response?.data?.detail || "Error al iniciar sesión"
      );
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);

      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("user");
      setUser(null);

      Swal.fire({
        title: "¡Hasta pronto!",
        text: "Has cerrado sesión correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

      return Promise.resolve();
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);

      Swal.fire({
        title: "Error",
        text: "Error al cerrar sesión",
        icon: "error",
      });

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
    <AuthContext.Provider
      value={{ user, login, logout, validateToken, isLoggingOut }}
    >
      {isLoggingOut && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>Cerrando sesión...</div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthorizationProvider;
