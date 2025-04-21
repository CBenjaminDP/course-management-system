import AuthorizationProvider from "../context/AuthorizationProvider";
import AuthGuard from "../context/AuthGuard";
import { AlertProvider } from "../context/AlertContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthorizationProvider>
      <AlertProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </AlertProvider>
    </AuthorizationProvider>
  );
}

export default MyApp;
