import Link from "next/link";
import { useCart } from "./hook/useCart";
import Image from "next/image";

const Navigation = ({siteLogoUrl}) => {
  const { cart } = useCart();

  const productsCount =
    null !== cart && Object.keys(cart).length ? cart.totalProductsCount : "";

  return (
    <nav
      className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
      aria-label="Global"
    >
      <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
        {siteLogoUrl ? (
          <Link href="/" legacyBehavior>
            <a
              key="siteLogo"
              className="flex-none text-xl font-semibold dark:text-white relative basis-3 py-10 px-12"
            >
              <Image
                src={siteLogoUrl}
                alt="logo"
                fill="cover"
                sizes="(max-width: 768px) 100%,
                  (max-width: 1200px) 50%,
                  33vw"
              />
            </a>
          </Link>
        ): (
          <div>SalviaExtact</div>
        )}

        <div className="relative">
          <Link href="/cart" legacyBehavior>
            <a className="relative text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {productsCount ? (
                <span className="absolute -top-2 -right-3">({productsCount})</span>
              ) : (
                ""
              )}
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
