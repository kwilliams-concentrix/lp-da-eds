// eslint-disable-next-line import/extensions
import { getConfigValue } from '../../configs.js';

const charMap = {
  '-': ' ',
  '@@@@@': ':',
  '@@@': '.',
  '@@': '$',
  '@': '-',
  ',': '&',
  '%3f': '?',
  '%22': '"',
  '%27': '\'',
  '%2a': '*',
  '%3e': '>',
  '%3c': '<',
};

export async function buildSearchQuery(searchTerm, fq, searchType = 'keyword') {
  const brAccountId = await getConfigValue('br.account-id');
  const brDomainKey = await getConfigValue('br.domain-key');
  const brResultsPerPage = await getConfigValue('br.max-results-per-page');

  const { href } = window.location;
  const { hostname } = window.location;
  const timeStamp = Date.now();
  return `
    query{
      BRPRODCAT_product_category_search_api(
        _br_uid_2: "uid%3D7797686432023%3Av%3D11.5%3Ats%3D1428617911187%3Ahc%3D55"
        account_id: ${brAccountId}
        domain_key: "${brDomainKey}"
        ref_url: "${href}"
        request_type: search
        search_type: ${searchType}
        fl: "pid,title,brand,price,sale_price,promotions,thumb_image,sku_thumb_images,sku_swatch_images,sku_color_group,url,price_range,sale_price_range,description"
        q: "chair"
        request_id: "br_${timeStamp}"
        fq: ${fq}
        rows: ${brResultsPerPage}
        start: 0
        url: "${hostname}"
      ) {
        autoCorrectQuery
        category_map
        did_you_mean
        facet_counts {
          type
          facets{
            name
            type
            value {
              name
              cat_name
              cat_id
            }
          }
          facet_queries
        }
        keywordRedirect {
          original_query
          redirected_query
          redirected_url
        }
        response {
          docs {
            title
            brand
            url
            pid
          }
          maxScore
          numFound
          start
        }
      }
    }
  `;
}

export async function extractParamsFromUrl(str = window.location.pathname, pairSeparator = '/', keySeparator = '_') {
  const table = str.replace(/\/s\/|\/c\//gi, '').split(pairSeparator).map((pair) => pair.split(keySeparator));
  return new Map(table);
}

function allReplace(str, obj = charMap) {
  let transform = str;
  for (const x in obj) {
    transform = decodeURIComponent(transform);
    transform = transform.replace(new RegExp(x, 'g'), obj[x]).replace(/(^|\s)[a-z]/gi, (l) => l.toUpperCase()).trim();
  }
  return transform;
}

export async function getSearchResults() {
  const apiMeshEndpoint = await getConfigValue('api-mesh-endpoint');
  const searchParams = await extractParamsFromUrl();

  let searchTerm = '';
  const fq = [];

  searchParams.forEach((value, key) => {
    if (key === 's') {
      searchTerm = value;
      return;
    }

    const newKey = allReplace(key);
    const newValue = allReplace(value);

    if (newKey !== '') {
      console.log(`${newKey}:"${newValue}"`);
      fq.push(`${newKey}:"${newValue}"`);
    }
  });

  console.log(`FQ: ${JSON.stringify(fq)}`);
  const query = await buildSearchQuery(searchTerm, JSON.stringify(fq));

  try {
    return fetch(apiMeshEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => data.data.BRPRODCAT_product_category_search_api)
      .catch((error) => console.error('Error:', error));
  } catch (err) {
    console.error('Could not execute GraphQl query to ', err);
  }
}
