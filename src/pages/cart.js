import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import Layout from "@/components/Layout";
import CartItemsContainer from "@/components/cart/cart-page/CartItemsContainer";

const Cart = ({ siteLogoUrl }) => {
  return (
    <Layout siteLogoUrl={siteLogoUrl}>
      <CartItemsContainer />
    </Layout>
  );
};

export default Cart;

export async function getStaticProps() {
  const GET_HEADER = gql`
    query Header {
      getHeader {
        siteLogoUrl
      }
    }
  `;

  const { data } = await client.query({
    query: GET_HEADER,
  });

  return {
    props: {
      siteLogoUrl: data.getHeader.siteLogoUrl,
    },
  };
}
