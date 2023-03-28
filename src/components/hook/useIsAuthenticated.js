import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import cookie from "cookie";

export function useIsAuthenticated() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    const token = cookies["authToken"];
    // console.log("Token:", token); // Debug: log the token value

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [router]);

  return { isAuthenticated, setIsAuthenticated };
}
