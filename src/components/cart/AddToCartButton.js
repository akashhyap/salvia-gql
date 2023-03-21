import { useState } from "react";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { v4 } from "uuid";
import cx from "classnames";

import { useCart } from "../hook/useCart";
import { getFormattedCart } from "@/lib/util";
import GET_CART from "@/lib/query/get-cart";
import ADD_TO_CART from "@/lib/mutation/add-to-cart";

const AddToCartButton = (props) => {
  const { product, selectedVariation } = props;

  const productQryInput = {
    clientMutationId: v4(),
    productId: selectedVariation
      ? selectedVariation.databaseId
      : product.databaseId,
    variationId: selectedVariation ? selectedVariation.variationId : null,
  };

  const [showViewCart, setShowViewCart] = useState(false);
  const [requestError, setRequestError] = useState(null);

  const { cart, refetch, error } = useCart();

  const [addToCart, { loading: addToCartLoading, error: addToCartError }] =
    useMutation(ADD_TO_CART, {
      variables: {
        input: productQryInput,
      },
      onCompleted: () => {
        // On Success:
        // 1. Make the GET_CART query to update the cart with new values in React context.
        refetch();

        // 2. Show View Cart Button
        setShowViewCart(true);
      },
      onError: (error) => {
        if (error) {
          setRequestError("error:", error?.graphQLErrors?.[0]?.message ?? "");
        }
      },
    });

  const handleAddToCartClick = async () => {
    setRequestError(null);
    await addToCart();
  };

  return (
    <div>
      {/* Check if it's an external product then put its external buy link */}
      {"ExternalProduct" === product.__typename ? (
        <a
          href={product?.externalUrl ?? "/"}
          target="_blank"
          className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current inline-block hover:bg-purple-600 hover:text-white hover:border-purple-600"
        >
          Buy now
        </a>
      ) : (
        <button
          disabled={addToCartLoading}
          onClick={handleAddToCartClick}
          className={cx(
            "px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current",
            {
              "hover:bg-slate-900 hover:text-white hover:border-slate-900":
                !addToCartLoading,
            },
            { "opacity-50 cursor-not-allowed": addToCartLoading }
          )}
        >
          {addToCartLoading ? "Adding to cart..." : "Add to cart"}
        </button>
      )}
      {showViewCart ? (
        <Link href="/cart">
          <button className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current hover:bg-slate-900 hover:text-white hover:border-slate-900">
            View Cart
          </button>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddToCartButton;
