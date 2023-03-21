// src/hooks/useSiteLogo.js
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_SITE_LOGO = gql`
  query GetSiteLogo {
    getHeader {
      siteLogoUrl
    }
  }
`;

export const useSiteLogo = () => {
  const { data, loading, error } = useQuery(GET_SITE_LOGO);

  const siteLogoUrl = data?.getHeader?.siteLogoUrl ?? null;

  return {
    siteLogoUrl,
    loading,
    error,
  };
};
