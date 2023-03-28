import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER_DATA = gql`
  query GetUserData {
    customer {
      id
      email
      firstName
      lastName
      orders {
        nodes {
          id
          total
          status
          date
          lineItems {
            nodes {
              id
              product {
                node {
                  databaseId
                  name
                }
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

const UserDashboard = () => {
  const { loading, error, data } = useQuery(GET_USER_DATA);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('woo-session');
    console.log('Logged out successfully.');
    router.push('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { customer } = data;

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>
        Welcome, {customer.firstName} {customer.lastName} ({customer.email})
      </p>
      <button onClick={handleLogout}>Logout</button>
      <h3>Orders</h3>
      {customer.orders.nodes.map((order) => (
        <div key={order.id}>
          <p>
            Order ID: {order.id} - Total: {order.total} - Status: {order.status} - Date: {order.date}
          </p>
          <p>Items:</p>
          <ul>
            {order.lineItems.nodes.map((item) => (
              <li key={item.id}>
                {item.product.node.name} (Quantity: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
