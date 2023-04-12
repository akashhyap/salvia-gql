import { useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";

const SignupForm = ({toggleForm}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (password !== passwordConfirmation) {
    //   alert("Passwords do not match");
    //   return;
    // }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName,lastName, email, password }),
    });

    if (response.ok) {
      console.log("Signup successful");
      router.push("/");
    } else {
      console.log("Signup failed");
    }
  };

  return (
    <>
      <h2 className="text-4xl mb-5">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm mb-2">
            Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-3 py-3 w-full rounded-sm mr-3 text-sm border-solid border border-current bg-slate-900 hover:bg-transparent text-white hover:text-slate-900 hover:border-slate-900"
        >
          Sign Up
        </button>
        <div className="mt-5">
          <p>
            Already a member 
            <button type="button" onClick={toggleForm} className="">
              <span className="ml-1 text-slate-900 underline underline-offset-2">
                login here
              </span>
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
