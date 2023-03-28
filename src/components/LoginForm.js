import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(
      input: {
        clientMutationId: "Login"
        username: $username
        password: $password
      }
    ) {
      authToken
      user {
        id
        username
        email
      }
    }
  }
`;

const LoginForm = () => {
  const [loginUser, { data, error }] = useMutation(LOGIN_USER);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: formData });
      if (data.login.authToken) {
        localStorage.setItem("authToken", data.login.authToken);
        console.log("Login successful!");
      } else {
        throw new Error("Login failed.");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
