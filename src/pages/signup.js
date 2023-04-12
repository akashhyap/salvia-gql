// pages/signup.js
import { useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import Layout from "@/components/Layout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const { token } = await response.json();
      localStorage.setItem("token", token);

      console.log("Registration successful");
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      console.log("Registration failed");
    }
  };

  return (
    <Layout>
      <main className="max-w-6xl mx-auto py-6">
      <h1 className="text-4xl mb-5">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-current rounded-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-current rounded-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-current rounded-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-current rounded-sm"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current hover:bg-slate-900 hover:text-white hover:border-slate-900"
        >
          Sign Up
        </button>
      </form>
    </main>
    </Layout>
  );
}
