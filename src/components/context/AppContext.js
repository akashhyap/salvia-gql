import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext([null, () => {}]);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get cart data from local storage
    if (typeof window !== 'undefined') {
      let cartData = localStorage.getItem('woo-next-cart');
	  cartData = null !== cartData ? JSON.parse(cartData) : '';
      setCart(cartData);
    }
  }, []);

  useEffect(() => {
    // Set session in local storage when user logs in or signs up
    if (typeof window !== 'undefined' && session) {
      localStorage.setItem('woo-session', session);
    }
  }, [session]);

  return (
    <CartContext.Provider value={[cart, setCart, session, setSession]}>
      {children}
    </CartContext.Provider>
  );
};
