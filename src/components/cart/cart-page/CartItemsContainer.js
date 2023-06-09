import Link from "next/link";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext } from "@/components/context/AppProvider";
import { getFormattedCart, getUpdatedItems } from "@/lib/util";

import CartItem from "./CartItem";
import { v4 } from "uuid";
import { from, useMutation, useQuery } from "@apollo/client";
import UPDATE_CART from "@/lib/mutation/update-cart";
import GET_CART from "@/lib/query/get-cart";
import CLEAR_CART_MUTATION from "@/lib/mutation/clear-cart";
import { isEmpty } from "lodash";

import CheckoutButton from "@/components/CheckoutButton";

const CartItemsContainer = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // @TODO wil use it in future variations of the project.
  const [cart, setCart] = useContext(CartContext);
  const [requestError, setRequestError] = useState(null);

  // Get Cart Data.
  const { loading, error, data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);
      localStorage.setItem("woo-next-cart", JSON.stringify(updatedCart));

      // Update cart data in React Context.
      if (mountedRef.current) {
        setCart(updatedCart);
      }
    },
  });

  // Update Cart Mutation.
  const [
    updateCart,
    {
      data: updateCartResponse,
      loading: updateCartProcessing,
      error: updateCartError,
    },
  ] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      if (error) {
        const errorMessage = error?.graphQLErrors?.[0]?.message
          ? error.graphQLErrors[0].message
          : "";
        setRequestError(errorMessage);
      }
    },
  });

  // Update Cart Mutation.
  const [
    clearCart,
    { data: clearCartRes, loading: clearCartProcessing, error: clearCartError },
  ] = useMutation(CLEAR_CART_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      if (error) {
        const errorMessage = !isEmpty(error?.graphQLErrors?.[0])
          ? error.graphQLErrors[0]?.message
          : "";
        setRequestError(errorMessage);
      }
    },
  });

  /*
   * Handle remove product click.
   *
   * @param {Object} event event
   * @param {Integer} Product Id.
   *
   * @return {void}
   */
  const handleRemoveProductClick = (event, cartKey, products) => {
    event.stopPropagation();
    if (products.length) {
      // By passing the newQty to 0 in updateCart Mutation, it will remove the item.
      const newQty = 0;
      const updatedItems = getUpdatedItems(products, newQty, cartKey);

      updateCart({
        variables: {
          input: {
            clientMutationId: v4(),
            items: updatedItems,
          },
        },
      });
    }
  };

  // Clear the entire cart.
  const handleClearCart = (event) => {
    event.stopPropagation();

    if (clearCartProcessing) {
      return;
    }

    clearCart({
      variables: {
        input: {
          clientMutationId: v4(),
          all: true,
        },
      },
    });
  };
  console.log("cart:",cart);
  return (
    <div className="cart product-cart-container max-w-6xl mx-auto my-32 px-4 xl:px-0">
      {cart ? (
        <div className="woo-next-cart-wrapper container">
          <div className="cart-header grid grid-cols-2 gap-4">
            <h1 className="text-2xl mb-5 uppercase">Cart</h1>
            {/*Clear entire cart*/}
            <div className="clear-cart text-right">
              <button
                className="px-4 py-1 bg-gray-500 text-white rounded-sm w-auto"
                onClick={(event) => handleClearCart(event)}
                disabled={clearCartProcessing}
              >
                <span className="woo-next-cart">Clear Cart</span>
                <i className="fa fa-arrow-alt-right" />
              </button>
              {clearCartProcessing ? <p>Clearing...</p> : ""}
              {updateCartProcessing ? <p>Updating...</p> : null}
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-0 xl:gap-4 mb-5">
            <table className="cart-products table-auto col-span-3 mb-5">
              <thead className="text-left">
                <tr className="woo-next-cart-head-container">
                  <th className="woo-next-cart-heading-el" scope="col" />
                  <th className="woo-next-cart-heading-el" scope="col" />
                  <th className="woo-next-cart-heading-el" scope="col">
                    Product
                  </th>
                  <th className="woo-next-cart-heading-el" scope="col">
                    Price
                  </th>
                  <th className="woo-next-cart-heading-el" scope="col">
                    Quantity
                  </th>
                  <th className="woo-next-cart-heading-el" scope="col">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.products.length &&
                  cart.products.map((item,i) => (
                    <CartItem
                      key={item.cartKey}
                      item={item}
                      updateCartProcessing={updateCartProcessing}
                      products={cart.products}
                      handleRemoveProductClick={handleRemoveProductClick}
                      updateCart={updateCart}
                    />
                  ))}
              </tbody>
            </table>

            {/*Cart Total*/}
            <div className="row woo-next-cart-total-container border p-5 bg-gray-200">
              <div className="">
                {/* <h2 className="text-2xl">Cart Total</h2> */}
                <table className="table table-hover mb-5">
                  <tbody>
                    <tr className="table-light flex flex-col">
                      <td className="woo-next-cart-element-total text-2xl font-normal">
                        Subtotal
                      </td>
                      <td className="woo-next-cart-element-amt text-2xl font-bold">
                        {"string" !== typeof cart.totalProductsPrice
                          ? cart.totalProductsPrice.toFixed(2)
                          : cart.totalProductsPrice}
                      </td>
                    </tr>
                    {/* <tr className="table-light">
										<td className="woo-next-cart-element-total">Total</td>
										<td className="woo-next-cart-element-amt">{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</td>
									</tr> */}
                  </tbody>
                </table>

                {/* place for WooCommerce checkout page */}
                <CheckoutButton />
              </div>
            </div>
          </div>

          {/* Display Errors if any */}
          {requestError ? (
            <div className="row woo-next-cart-total-container mt-5">
              {requestError}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="container mx-auto my-32 px-4 xl:px-0">
          <h2 className="text-2xl mb-5">No items in the cart</h2>
          <Link href="/" legacyBehavior>
            <a className="bg-purple-600 text-white px-5 py-3 rounded-sm">
              Add New Products
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartItemsContainer;
