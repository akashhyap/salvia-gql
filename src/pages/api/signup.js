// pages/api/signup.js
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import jwt from "jsonwebtoken";

const REGISTER_MUTATION = gql`
  mutation RegisterCustomer(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $clientMutationId: String!
  ) {
    registerCustomer(
      input: {
        clientMutationId: $clientMutationId
        username: $email
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        billing: { firstName: $firstName, lastName: $lastName }
      }
    ) {
      customer {
        id
        email
      }
      authToken
    }
  }
`;

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL}/graphql`,
  cache: new InMemoryCache(),
});

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password, firstName, lastName } = req.body;
      console.log("Request body:", req.body);

      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          email,
          password,
          firstName,
          lastName,
          clientMutationId: 'register_' + email,
        },
      });

      console.log("GraphQL response:", data);

      const { customer, authToken } = data.registerCustomer;

      res.status(200).json({ ...customer, token: authToken });
    } catch (error) {
      console.error("Registration failed:", error.message);
      res.status(400).json({ error: `Registration failed: ${error.message}` });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
