import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthorizationProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined para evitar redirecciones antes de tiempo
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setUser(null);
      // No redirigir automáticamente al login
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data); // Guarda el usuario en el contexto
      })
      .catch(() => {
        Cookies.remove("token");
        setUser(null);
        router.push("/login");
      });
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      Cookies.set("token", data.token, {
        expires: 7,
        secure: false,
        sameSite: "Strict",
      });
      setUser(data);
      router.push("/");
    } catch (error) {
      throw new Error("Credenciales incorrectas.");
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
