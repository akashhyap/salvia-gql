import { createContext, useState, useContext } from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const getInitialAuthState = () => {
  const token = Cookies.get("authToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.userId) {
        return true;
      }
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  return false;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState());

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
