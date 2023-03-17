import Head from "next/head";
import Image from "next/image";
import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";

import Layout from "@/components/Layout";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function Home({ products }) {
  // console.log("products:",products);
  return (
    <Layout>
      <main className="max-w-6xl mx-auto py-6">
        <div className="grid grid-cols-3">
          {products?.edges.map((product) => {
            // console.log("product node:", product.node);
            const { id, name, price, slug } = product.node;
            return (
              <div key={id} href={`/products/${slug}`}>
                <Link key={id} href={`/products/${slug}`} legacyBehavior>
                  <a>
                    <h2 className="text-xl py-2">{name}</h2>
                    <p>{price}</p>
                  </a>
                </Link>
                <AddToCartButton product={product.node}/>
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const PRODUCT_QUERY = gql`
    query {
      products(first: 10) {
        edges {
          node {
            id
            slug
            name
            type
            productId: databaseId
            shortDescription
            image {
              id
              sourceUrl
              altText
            }
            ... on SimpleProduct {
              onSale
              stockStatus
              price
              regularPrice
              salePrice
            }
            ... on VariableProduct {
              onSale
              stockStatus
              price
              regularPrice
              salePrice
            }
          }
        }
      }
    }
  `;
  const response = await client.query({
    query: PRODUCT_QUERY,
  });
  const products = response?.data?.products;

  return {
    props: {
      products,
    },
    revalidate: 1
  };
}
