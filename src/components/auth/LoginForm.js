// components/auth/LoginForm.js
import { useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";

const LoginForm = ({ toggleForm, onLoginSuccess }) => {
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
      const { token, woocommerceSession } = await response.json();
      localStorage.setItem("authToken", token);
      localStorage.setItem("woo-session", woocommerceSession); // Add this line
      setIsAuthenticated(true);
      console.log("Login successful");
      onLoginSuccess();
      router.push("/");
    } else {
      console.log("Login failed");
    }
  };

  return (
    <>
      <h2 className="text-4xl mb-5">Login</h2>
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
              className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
              required
              aria-describedby="email-error"
            />
            <p className="hidden text-xs text-red-600 mt-2" id="email-error">
              Please include a valid email address so we can get back to you
            </p>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
              required
              aria-describedby="password-error"
            />
            <p className="hidden text-xs text-red-600 mt-2" id="password-error">
              8+ characters required
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="px-3 py-3 w-full rounded-sm mr-3 text-sm border-solid border border-current bg-slate-900 hover:bg-transparent text-white hover:text-slate-900 hover:border-slate-900"
        >
          Login
        </button>
        <div className="mt-5">
          <p>
            Are you a new user? Create an account
            <button type="button" onClick={toggleForm} className="">
              <span className="ml-1 text-slate-900 underline underline-offset-2">
                here
              </span>
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
