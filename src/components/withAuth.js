// withAuth.js
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const isAuthenticated = () => {
      const token =
        typeof window !== "undefined" && localStorage.getItem("auth-token");
      return token !== null;
    };

    useEffect(() => {
      if (!isAuthenticated()) {
        router.replace("/login");
      }
    }, [router]);

    return <Component {...props} isAuthenticated={isAuthenticated()} />;
  };
}
