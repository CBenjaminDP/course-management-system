import AuthorizationProvider from "../context/AuthorizationProvider";
import AuthGuard from "../context/AuthGuard";
import { AlertProvider } from "../context/AlertContext";

function MyApp({ Component, pageProps }) {
  return (
    <AlertProvider>
      <AuthorizationProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </AuthorizationProvider>
    </AlertProvider>
  );
}

export default MyApp;
