import { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CartContext } from "../context/AppProvider";
import GET_CART from "@/lib/query/get-cart";
import { getFormattedCart } from "@/lib/util";

export const useCart = () => {
  const [cart, setCart] = useContext(CartContext);

  const { data, refetch, error } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data) {
      const updatedCart = getFormattedCart(data);
      setCart(updatedCart);
    }
  }, [data, setCart]);

  return { cart, refetch, error };
};
