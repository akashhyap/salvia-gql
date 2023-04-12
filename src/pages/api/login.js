// pages/api/login.js
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { gql } from "@apollo/client";
import axios from "axios";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      user {
        id
        email
      }
    }
  }
`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL}/graphql`, {
        query: LOGIN_MUTATION.loc.source.body,
        variables: {
          username: email,
          password,
        },
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { data } = response.data;

      if (response.status === 200) {
        const { authToken, user } = data.login;

        // Get the woocommerce-session token from the response headers
        const sessionToken = response.headers["woocommerce-session"];
        console.log("sessionToken:", sessionToken);

        // Create and sign JWT token with user data
        const token = jwt.sign(
          {
            userId: user.id,
            userEmail: user.email,
          },
          JWT_SECRET,
          { expiresIn: "10h" }
        );

        // Set the authToken cookie
        res.setHeader(
          "Set-Cookie",
          serialize("authToken", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 3600,
            path: "/",
          })
        );

        // Add the woocommerce-session token to the response
        res.status(200).json({ token, woocommerceSession: sessionToken });
      } else {
        console.error("Login failed:", data.errors);
        res.status(400).json({ error: "Login failed" });
      }
    } catch (error) {
      console.error("Login failed:", error);
      res.status(400).json({ error: "Login failed" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
