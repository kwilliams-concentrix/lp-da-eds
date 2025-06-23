// Dropin Components
import {
  Button,
  provider as UI,
} from '@dropins/tools/components.js';

// Block-level
import createModal from '../modal/modal.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getRootPath } from '../../scripts/scripts.js';
import { getProductListing } from '../../scripts/helper/search.js';

/**
 * Toggles all storeSelector sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // decorate footer DOM
  block.textContent = '';
  const listing = document.createElement('div');
  listing.classList.add('listing', 'content');

  const listingData = getProductListing();
  const listingHtml = `
    <div>Listing Page container HTML here1</div>
    <div>${JSON.stringify(listingData.docs, null,2)}</div>
  `;

  listing.innerHTML = listingHtml;
  block.append(listing);
}
