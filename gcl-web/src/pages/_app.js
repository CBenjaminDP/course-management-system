import AuthorizationProvider  from "../context/AuthorizationProvider";
import AuthGuard from "../context/AuthGuard"; // ✅ Importa el AuthGuard corregido

function MyApp({ Component, pageProps }) {
  return (
    <AuthorizationProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </AuthorizationProvider>
  );
}

export default MyApp;
