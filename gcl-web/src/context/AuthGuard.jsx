import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./AuthorizationProvider";
import Cookies from "js-cookie";

const AuthGuard = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      // Check for token directly
      const accessToken = Cookies.get("accessToken");

      // If no token but user state thinks we're logged in, fix the state
      if (!accessToken && user) {
        console.log("Token missing but user state exists, fixing state");
        setUser(null);
      }

      // If user state is defined (not undefined)
      if (user !== undefined) {
        // If user is null (logged out) and not on an allowed public page
        if (
          user === null &&
          !["/login", "/", "/register"].includes(window.location.pathname)
        ) {
          console.log("User logged out, redirecting to login page");
          window.location.href = "/login"; // Use direct navigation instead of router
        }
        // If user is authenticated and on login or home page
        else if (user && ["/login", "/"].includes(window.location.pathname)) {
          router.push("/dashboard");
        }
      }
    }
  }, [user, router]);

  return children;
};

export default AuthGuard;
