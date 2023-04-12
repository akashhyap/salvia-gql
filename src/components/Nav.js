import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./hook/useCart";
import { useIsAuthenticated } from "./hook/useIsAuthenticated";
import Cookies from "js-cookie";
import AuthModal from "./AuthModal";
import { useState } from "react";

const Navigation = ({ siteLogoUrl }) => {
  const router = useRouter();

  const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();

  // console.log("isAuthenticated in Navigation:", isAuthenticated);

  const { cart } = useCart();

  const productsCount =
    null !== cart && Object.keys(cart).length ? cart.totalProductsCount : "";

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [shouldCloseAuthModal, setShouldCloseAuthModal] = useState(false);

  const openAuthModal = (shouldCloseModal = false) => {
    setShouldCloseAuthModal(shouldCloseModal);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = (isAuthenticated) => {
    if (shouldCloseAuthModal && isAuthenticated) {
      setIsAuthModalOpen(false);
      setShouldCloseAuthModal(false);
    }
  };

  const handleLoginSuccess = () => {
    closeAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        Cookies.remove("authToken"); // Add this line to remove authToken cookie
        localStorage.removeItem('authToken');

        router.push("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isAuthModalOpen && (
        <AuthModal
          closeModal={closeAuthModal}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          shouldCloseModal={shouldCloseAuthModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <nav
        className="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center justify-between">
          <Link href="/" legacyBehavior>
            <a className="text-white">SalviaExtact</a>
          </Link>
          {/* {siteLogoUrl ? (
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
          ) : (
            <div>
              <Link href="/" legacyBehavior>
                <a className="text-white">SalviaExtact</a>
              </Link>
            </div>
          )} */}
        </div>
        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7 pr-4">
            {isAuthenticated ? (
              <>
                <Link href="/account" legacyBehavior>
                  <a className="text-white">Account</a>
                </Link>
                <button className="text-white" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="text-white" onClick={openAuthModal}>
                Login
              </button>
            )}

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
                  <span className="absolute -top-1 -right-3">
                    ({productsCount})
                  </span>
                ) : (
                  ""
                )}
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
