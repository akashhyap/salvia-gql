import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../cart/AddToCartButton";

const Product = ({ product }) => {
    // console.log("product::", product);
  return (
    <div className="border border-slate-900 rounded-md overflow-hidden">
      <Link href={`/products/${product.node.slug}`} legacyBehavior>
        <a>
          <figure className="relative pt-[85%]">
            <Image
              src={product.node?.image?.sourceUrl ?? ""}
              alt="Image product"
              fill="cover"
              sizes="(max-width: 768px) 100%,
              (max-width: 1200px) 50%,
              33vw"
            />
          </figure>
        </a>
      </Link>
      <div className="p-4">
        <h2 className="text-xl py-2">
          <Link href={`/products/${product.node.slug}`} legacyBehavior>
            {product.node.name}
          </Link>
        </h2>
        <p className="py-2">{product.node.price}</p>

        {product.node?.type !== "VARIABLE" ? (
          <AddToCartButton product={product.node} />
        ) : (
          <Link href={`/products/${product.node?.slug}`} legacyBehavior>
            <a className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current hover:bg-slate-900 hover:text-white hover:border-slate-900">
              Select Option
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Product;
