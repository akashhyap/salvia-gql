import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";

function getProductTypeJSX(product) {
  switch (product.__typename) {
    case "SimpleProduct":
      return <p>{product.regularPrice}</p>;
    case "VariableProduct":
      return (
        <ul>
          {product?.variations?.nodes.map((variation) => {
            return (
              <li key={variation.id}>
                <h3>{variation.name}</h3>
                <p>{variation.regularPrice}</p>
              </li>
            );
          })}
        </ul>
      );
    default:
    // logic for other product types
  }
}

export default function Product({ product }) {
  console.log("product:", product);
  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl">{product.name}</h1>

      <div>{getProductTypeJSX(product)}</div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  console.log("params:", params);
  const GET_SINGLE_PRODUCT = gql`
    query Product($id: ID!) {
      product(id: $id, idType: SLUG) {
        id
        databaseId
        averageRating
        slug
        description
        onSale
        image {
          id
          uri
          title
          srcSet
          sourceUrl
        }
        name
        ... on SimpleProduct {
          salePrice
          regularPrice
          price
          id
          stockQuantity
        }
        ... on VariableProduct {
          salePrice
          regularPrice
          price
          id
          allPaSizes {
            nodes {
              name
            }
          }
          allPaSizes {
            nodes {
              name
            }
          }
          variations {
            nodes {
              id
              databaseId
              name
              stockStatus
              stockQuantity
              purchasable
              onSale
              salePrice
              regularPrice
            }
          }
        }
        ... on ExternalProduct {
          price
          id
          externalUrl
        }
        ... on GroupProduct {
          products {
            nodes {
              ... on SimpleProduct {
                id
                price
              }
            }
          }
          id
        }
      }
    }
  `;

  const { data } = await client.query({
    query: GET_SINGLE_PRODUCT,
    variables: {
      id: params.slug,
    },
  });
  //   const page = response?.data?.page;

  return {
    props: {
      product: data.product,
    },
  };
}

export async function getStaticPaths() {
  const GET_PRODUCTS_SLUGS = gql`
    query Products {
      products {
        nodes {
          slug
        }
      }
    }
  `;

  const { data } = await client.query({
    query: GET_PRODUCTS_SLUGS,
  });

  const paths = data.products.nodes.map((product) => ({
    params: { slug: product.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
