// hooks/useCustomerOrders.js
import { useQuery, gql } from "@apollo/client";

export const GET_CUSTOMER_ORDERS = gql`
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

// hooks/useCustomerOrders.js
// ...
export function useCustomerOrders(customerId) {
    const { data, loading, error } = useQuery(GET_CUSTOMER_ORDERS, {
      variables: { customerId },
      skip: !customerId,
    });
  
    const orders = data?.customer?.orders?.nodes || []; // Add an empty array as the default value
  
    return { orders, loading, error };
  }
  
