// pages/api/login.js
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

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

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL}/graphql`,
  cache: new InMemoryCache(),
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          username: email,
          password,
        },
      });

     
      const { authToken, user } = data.login;
      // console.log("authToken from server:", authToken); // Debug: log the authToken value from the server


      // Create and sign JWT token with user data
      const token = jwt.sign(
        {
          userId: user.id,
          userEmail: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // console.log("JWT_SECRET login:",JWT_SECRET);
      // console.log("token login:", token);

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
      

      res.status(200).json({ token }); // Removed authToken from the response
    } catch (error) {
      console.error("Login failed:", error);
      res.status(400).json({ error: "Login failed" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
