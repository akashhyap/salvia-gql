import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const CheckoutButton = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const jwtSession = window.localStorage.getItem('woo-session');
    if (jwtSession) {
      try {
        const decoded = jwtDecode<{ data: { customer_id: string } }>(jwtSession);
        setSession(decoded.data.customer_id);
      } catch (err) {
        console.warn('Error decoding session:', err);
      }
    }
  }, []);

  const checkoutLink = () => {
    if (session) {
      window.open(`https://woocommerce-186938-3327038.cloudwaysapps.com/checkout?session_id=${session}`);
    } else {
      console.warn('Session not found');
    }
  };

  return (
    <button className='p-2 bg-slate-900 rounded-md text-white' onClick={checkoutLink}>Checkout</button>
  );
};

export default CheckoutButton;
