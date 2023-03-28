import { createContext, useState, useEffect } from "react";

export const CartContext = createContext([null, () => {}]);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      let cartData = localStorage.getItem("woo-next-cart");
      cartData = null !== cartData ? JSON.parse(cartData) : "";
      if (isMounted) {
        setCart(cartData);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined" && session) {
      if (isMounted) {
        localStorage.setItem("woo-session", session);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [session]);

  return (
    <CartContext.Provider value={[cart, setCart, session, setSession]}>
     {children}
    </CartContext.Provider>
  );
};
