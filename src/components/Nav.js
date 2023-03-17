import Link from "next/link";
import { useContext } from 'react';

import { CartContext } from "./context/AppContext";

const Navigation = () => {
  const [cart] = useContext(CartContext);
  const productsCount =
    null !== cart && Object.keys(cart).length ? cart.totalProductsCount : "";

    // console.log("cart:", cart);
    // console.log("productsCount:", productsCount);
    // console.log("useContext(CartContext):", useContext(CartContext));
  return (
    <ul className="py-3 bg-slate-900 text-white text-center">
     
      <li>
        Cart{" "}
        {productsCount ? <span className="ml-1">({productsCount})</span> : ""}
      </li>
    </ul>
  );
};

export default Navigation