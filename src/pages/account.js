// pages/account.js
import jwt from 'jsonwebtoken';
import cookie from "cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import Layout from "@/components/Layout";
import { useIsAuthenticated } from "@/components/hook/useIsAuthenticated";
import { verifyToken } from "@/lib/auth";

function Account({ userEmail }) {
  const router = useRouter();
  const { isAuthenticated } = useIsAuthenticated();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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
    <Layout>
      <div className="container mx-auto">
        <h1>User Account</h1>
        <p>Email: {userEmail}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </Layout>
  );
}

export default Account;

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || "");
  const token = cookies["authToken"];

  console.log("Token in getServerSideProps:", token); // Debug: log the token value from the cookie

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userData = jwt.decode(token);

  console.log("User data in getServerSideProps:", userData); // Debug: log the decoded user data

  if (!userData) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: { userEmail: '' },
    };
  }

  return {
    props: { userEmail: userData.userEmail },
  };
}

