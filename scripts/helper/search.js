import { getSearchResults } from './search/graphql.js';

const data = await getSearchResults();

// TODO Parse out results and facets
export function getProductListing() {
  return data.response;
}
export function getFacets() {
  return data.facet_counts.facets;
}

export function getSearchResponse() {
  return data;
}
