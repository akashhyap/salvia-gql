import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Layout from "@/components/Layout";
import Image from "next/image";
import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function Product({ product, siteLogoUrl }) {
  // console.log("product single:", product);

  const [selectedVariationId, setSelectedVariationId] = useState();
  const [selectedVariation, setSelectedVariation] = useState();

  const handleVariationChange = (event) => {
    const selectedId = parseInt(event.target.value);

    if (isNaN(selectedId)) {
      setSelectedVariationId("");
      setSelectedVariation(null);
    } else {
      setSelectedVariationId(selectedId);
      const variation = product?.variations?.nodes.find((varItem) => {
        return varItem.databaseId === selectedId;
      });

      setSelectedVariation(variation);
    }
  };

  return (
    <Layout siteLogoUrl={siteLogoUrl}>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-10 mt-10">
        <div>
          <figure className="relative pt-[85%] border border-slate-300 rounded-lg overflow-hidden">
            <Image
              src={product?.image?.sourceUrl ?? ""}
              alt="Image product"
              fill
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            />
          </figure>
        </div>
        <div>
          <h1 className="text-4xl mb-5">{product.name}</h1>
          <div className="flex justify-between">
            {selectedVariation ? (
              <p className="price mb-5 text-xl">
                {selectedVariation.regularPrice}
              </p>
            ) : (
              <p className="product-price mb-5 text-xl">
                {product.regularPrice}
              </p>
            )}

            <p>
              {product?.stockStatus === "IN_STOCK" ? (
                <span className="bg-green-400 text-sm px-2 py-1 rounded-md">
                  In stock
                </span>
              ) : (
                <span className="bg-red-400 text-sm px-2 py-1 rounded-md">
                  Out of stock
                </span>
              )}
            </p>
          </div>

          {product.__typename === "VariableProduct" ? (
            <>
              <div className="variation-select">
                <label htmlFor="variation">Size:</label>
                <select
                  value={selectedVariationId}
                  onChange={handleVariationChange}
                  className="border rounded-sm p-1 ml-2"
                >
                  <option value="">Select</option>

                  {product?.variations?.nodes.map((variation) => (
                    <option
                      key={variation.databaseId}
                      value={variation.databaseId}
                    >
                      {variation.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.shortDescription),
            }}
            className="product-description my-5 [&>p]:text-lg [&>p]:py-4 [&>p]:leading-8 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:leading-8 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:leading-8"
          />

          <div className="mt-5">
            <AddToCartButton
              product={product}
              selectedVariation={selectedVariation}
            />
          </div>
        </div>
      </div>
      <div className="flex max-w-6xl mx-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description),
          }}
          className="product-description mb-5 [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:py-4 [&>p]:text-lg [&>p]:py-4 [&>p]:leading-8 [&>h3]:text-2xl [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:leading-8 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:leading-8"
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  // console.log("params:", params);
  const GET_SINGLE_PRODUCT = gql`
    query Product($id: ID!) {
      getHeader {
        siteLogoUrl
      }
      product(id: $id, idType: SLUG) {
        id
        databaseId
        averageRating
        slug
        description
        shortDescription
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
          stockStatus
          price
          id
          stockQuantity
        }
        ... on VariableProduct {
          salePrice
          regularPrice
          stockStatus
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
      siteLogoUrl: data.getHeader.siteLogoUrl,
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
