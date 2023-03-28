import "@/styles/globals.css";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { AppProvider } from "@/components/context/AppProvider";
import { AuthProvider } from "@/components/context/AuthContext";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("preline");
  }, []);
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  );
}
