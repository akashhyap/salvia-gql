// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import Layout from "@/components/Layout";
import { useAuth } from "@/components/context/AuthContext";
import client from "@/lib/apollo";
import { gql } from "@apollo/client";

export default function Login({ siteLogoUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { authToken, token } = await response.json();
      localStorage.setItem("authToken", token);
      // localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
      console.log("Login successful");
      router.push("/");
    } else {
      console.log("Login failed");
    }
  };

  return (
    <Layout siteLogoUrl={siteLogoUrl}>
      <main className="max-w-6xl mx-auto py-6">
        <h1 className="text-4xl mb-5">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" required aria-describedby="email-error"
              />
              <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                Please include a valid email address so we can get back to you
              </p>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" required aria-describedby="password-error"
              />
              <p
                className="hidden text-xs text-red-600 mt-2"
                id="password-error"
              >
                8+ characters required
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="px-3 py-3 inline-flex rounded-sm mr-3 text-sm border-solid border border-current hover:bg-slate-900 hover:text-white hover:border-slate-900"
          >
            Login
          </button>
        </form>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const QUERY = gql`
    query {
      getHeader {
        siteLogoUrl
      }
    }
  `;
  const response = await client.query({
    query: QUERY,
  });
  const siteLogoUrl = response?.data?.getHeader.siteLogoUrl;

  return {
    props: {
      siteLogoUrl,
    },
    revalidate: 1,
  };
}
