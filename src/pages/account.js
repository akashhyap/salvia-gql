// pages/account.js
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import Layout from "@/components/Layout";
import { useIsAuthenticated } from "@/components/hook/useIsAuthenticated";
import { verifyToken } from "@/lib/auth";
import client from "@/lib/apollo";
import { gql } from "@apollo/client";

function Account({ siteLogoUrl, userEmail }) {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, loading } = useIsAuthenticated(); // Update this line to include loading

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Update this line to consider the loading state
      router.push("/login");
    }
  }, [isAuthenticated, router, loading]); // Add loading to the dependency array

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        setIsAuthenticated(false);
        Cookies.remove("authToken"); // Add this line to remove authToken cookie
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout siteLogoUrl={siteLogoUrl}>
      <main className="max-w-6xl mx-auto py-6">
        <h1 className="text-4xl mb-5">User Account</h1>
        <p>Email: {userEmail}</p>
        <button
          onClick={handleLogout}
          className="px-3 py-1 mt-5 rounded-sm mr-3 text-sm border-solid border border-current hover:bg-slate-900 hover:text-white hover:border-slate-900"
        >
          Logout
        </button>
      </main>
    </Layout>
  );
}

export default Account;

export async function getServerSideProps(context) {
  const ACCOUNT_QUERY = gql`
    query {
      getHeader {
        siteLogoUrl
      }
    }
  `;
  const response = await client.query({
    query: ACCOUNT_QUERY,
  });

  const siteLogoUrl = response?.data?.getHeader.siteLogoUrl;

  const cookies = cookie.parse(context.req.headers.cookie || "");
  const token = cookies["authToken"];

  // console.log("Token in getServerSideProps:", token); // Debug: log the token value from the cookie

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userData = jwt.decode(token);

  // console.log("User data in getServerSideProps:", userData); // Debug: log the decoded user data

  if (!userData) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: { userEmail: "" },
    };
  }

  return {
    props: { userEmail: userData.userEmail, siteLogoUrl },
  };
}
