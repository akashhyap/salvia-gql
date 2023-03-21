import Head from "next/head";
import Image from "next/image";
import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";

import Layout from "@/components/Layout";
import Products from "@/components/products";

export default function Home({ products, siteLogoUrl }) {
  // console.log("home products:",products);
  return (
    <Layout siteLogoUrl={siteLogoUrl}>
      <main className="max-w-6xl mx-auto py-6">
        <div className="grid grid-cols-1">
          <Products products={products} />
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const PRODUCT_QUERY = gql`
    query {
      getHeader {
        siteLogoUrl
      }
      products(first: 10) {
        edges {
          node {
            id
            slug
            name
            type
            databaseId
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
  const siteLogoUrl = response?.data?.getHeader.siteLogoUrl;

  return {
    props: {
      products,
      siteLogoUrl,
    },
    revalidate: 1,
  };
}
