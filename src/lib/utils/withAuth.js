// lib/utils/withAuth.js
import { useAuth } from "@/components/context/AuthContext";

export function withAuth(PageComponent) {
  const WithAuth = (props) => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    if (typeof window !== "undefined" && props.isAuthenticated && !isAuthenticated) {
      setIsAuthenticated(true);
    }

    return <PageComponent {...props} />;
  };

  return WithAuth;
}
