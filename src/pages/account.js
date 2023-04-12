import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apollo";
import atob from "atob";
import Layout from "@/components/Layout";

const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerId: Int) {
    customer(customerId: $customerId) {
      email
      orders {
        nodes {
          id
          orderKey
          date
          total
          status
          billing {
            firstName
            lastName
            company
            address1
            address2
            city
            state
            postcode
            country
            email
            phone
          }
          customer {
            id
          }
        }
      }
    }
  }
`;

export default function Account() {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (localStorage.getItem("woo-session")) {
        try {
          console.log("Inside try block");

          const authToken = localStorage.getItem("authToken");
          const decodedToken = jwt_decode(authToken);
          const base64UserId = decodedToken.userId;
          const decodedUserId = atob(base64UserId);
          const customerId = parseInt(decodedUserId.replace("user:", ""), 10);

          console.log("CustomerId: ", customerId);
          console.log("authToken: ", authToken);

          const { data, errors } = await client.query({
            query: GET_CUSTOMER_ORDERS,
            variables: { customerId },
          });

          if (errors) {
            console.error("GraphQL Errors:", errors);
            throw new Error(errors[0].message);
          }

          console.log("Data fetched:", data);
          setOrdersData(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <h1>Orders</h1>
      {ordersData &&
        ordersData.customer.orders.nodes.map((order) => (
          <div key={order.id}>
            <h2>Order ID: {order.id}</h2>
            <h3>Total: {order.total}</h3>
            <ul>
              {order.lineItems.nodes.map((item) => (
                <li key={item.product.id}>
                  {item.product.name} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        ))}
    </Layout>
  );
}
