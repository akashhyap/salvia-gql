import React, { useState } from "react";
import jwtDecode from "jwt-decode";

const CheckoutButton = () => {
    const [session, setSession] = useState(() => {
      const jwtSession = window.localStorage.getItem("woo-session");
  
      let session = null;
  
      if (jwtSession) {
        try {
          const decoded = jwtDecode(jwtSession);
  
          if (typeof decoded.data.customer_id === "string") {
            session = decoded.data.customer_id;
            console.info("decoded session:", session);
          } else {
            console.error("Invalid session ID format");
          }
        } catch (error) {
          console.error("Error decoding session:", error);
        }
      }
  
      return session;
    });
  
    const checkoutLink = () => {
      console.log("session id:", session);
      window.open(`https://woocommerce-186938-3327038.cloudwaysapps.com/checkout?session_id=${session}`)
    };
  
    return <button onClick={() => checkoutLink()}>Checkout</button>;
  };
  
  export default CheckoutButton;
  
