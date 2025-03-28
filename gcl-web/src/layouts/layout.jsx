import { AuthProvider } from "../context/AuthorizationProvider";

export default function RootLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
