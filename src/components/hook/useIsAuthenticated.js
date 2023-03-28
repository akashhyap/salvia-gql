import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import cookie from "cookie";

export function useIsAuthenticated() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add this line

  const updateAuthState = () => {
    const cookies = cookie.parse(document.cookie);
    const token = cookies["authToken"];
    console.log("Token in useIsAuthenticated:", token); // Debug: log the token value

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); // Add this line
  };

  useEffect(() => {
    updateAuthState();
  }, [router]);

  return { isAuthenticated, setIsAuthenticated, loading }; // Add loading to the return statement
}
