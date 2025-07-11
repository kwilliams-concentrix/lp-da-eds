/* eslint-disable import/no-unresolved */

// Drop-in Tools
import { events } from '@dropins/tools/event-bus.js';

// Cart dropin
import { publishShoppingCartViewEvent } from '@dropins/storefront-cart/api.js';

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

import renderAuthCombine from './renderAuthCombine.js';
import { renderAuthDropdown } from './renderAuthDropdown.js';
import { rootLink } from '../../scripts/scripts.js';
import applyHashTagsForDomElement from '../../scripts/api/hashtags/api.js';

// check the localStorage for a customer type and apply the appropriate styles
import { getCustomerType } from '../../scripts/helper/customer.js';
const customerType = getCustomerType();

// check the localStorage for a customer type and add the appropriate class
if (customerType === 'Pro') {
  document.body.classList.add('pro');
}

if (customerType === 'Employee') {
  document.body.classList.add('employee');
}

if (customerType === 'Customer') {
  document.body.classList.add('customer');
}

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

const header = document.querySelector('header.header-wrapper');
const headerBlock = document.querySelector('.header.block');

let stickyCutoffPosition = 75;
let headerIsCollapsed = false;

// array of nav menu sections that should be highlighted
export const highlightedLinks = ['Sale'];

const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.querySelector('header').insertAdjacentElement('afterbegin', overlay);

function closeAllPanels() {
  document.querySelectorAll('.show').forEach((el) => {
    el.classList.remove('show');
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      overlay.classList.remove('show');
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      // toggleMenu(nav, navSections);
      overlay.classList.remove('show');
      nav.querySelector('button').focus();
      const navWrapper = document.querySelector('.nav-wrapper');
      navWrapper.classList.remove('active');
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      // toggleAllNavSections(navSections, false);
      overlay.classList.remove('show');
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      // toggleMenu(nav, navSections, true);
    }
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

export function isMobile() {
  return window.innerWidth < 900;
}

function measureStickyPosition() {
  const headerMain = document.getElementById('header-main');
  stickyCutoffPosition = headerMain.offsetTop;
  header.style.top = `${stickyCutoffPosition * -1}px`;
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    // toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

// /**
//  * Toggles all nav sections
//  * @param {Element} sections The container element
//  * @param {Boolean} expanded Whether the element should be expanded or collapsed
//  */
// function toggleAllNavSections(sections, expanded = false) {
//   sections
//     .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
//     .forEach((section) => {
//       section.setAttribute('aria-expanded', expanded);
//     });
// }

// /**
//  * Toggles the entire nav
//  * @param {Element} nav The container element
//  * @param {Element} navSections The nav sections within the container element
//  * @param {*} forceExpanded Optional param to force nav expand behavior when not null
//  */
// function toggleMenu(nav, navSections, forceExpanded = null) {
//   const expanded =
//     forceExpanded !== null
//       ? !forceExpanded
//       : nav.getAttribute('aria-expanded') === 'true';
//   const button = nav.querySelector('.nav-hamburger button');
//   document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
//   nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//   // toggleAllNavSections(
//   //   navSections,
//   //   expanded || isDesktop.matches ? 'false' : 'true'
//   // );
//   button.setAttribute(
//     'aria-label',
//     expanded ? 'Open navigation' : 'Close navigation'
//   );
//   // enable nav dropdown keyboard accessibility
//   const navDrops = navSections.querySelectorAll('.nav-drop');
//   if (isDesktop.matches) {
//     navDrops.forEach((drop) => {
//       if (!drop.hasAttribute('tabindex')) {
//         drop.setAttribute('tabindex', 0);
//         drop.addEventListener('focus', focusNavSection);
//       }
//     });
//   } else {
//     navDrops.forEach((drop) => {
//       drop.classList.remove('active');
//       drop.removeAttribute('tabindex');
//       drop.removeEventListener('focus', focusNavSection);
//     });
//   }

//   // enable menu collapse on escape keypress
//   if (!expanded || isDesktop.matches) {
//     // collapse menu on escape press
//     window.addEventListener('keydown', closeOnEscape);
//     // collapse menu on focus lost
//     nav.addEventListener('focusout', closeOnFocusLost);
//   } else {
//     window.removeEventListener('keydown', closeOnEscape);
//     nav.removeEventListener('focusout', closeOnFocusLost);
//   }
// }

const subMenuHeader = document.createElement('div');
subMenuHeader.classList.add('submenu-header');
subMenuHeader.innerHTML = '<h5 class="back-link">All Categories</h5><hr />';

/**
 * Sets up the submenu
 * @param {navSection} navSection The nav section element
 */
function setupSubmenu(navSection) {
  if (navSection.querySelector('ul')) {
    let label;
    if (navSection.childNodes.length) {
      [label] = navSection.childNodes;
    }

    const submenu = navSection.querySelector('ul');
    const wrapper = document.createElement('div');
    const header = subMenuHeader.cloneNode(true);

    const col1div = document.createElement('div');
    col1div.classList.add('submenu-section');

    const col2div = document.createElement('div');
    col2div.classList.add('submenu-links');
    col2div.appendChild(submenu.cloneNode(true));

    const title = document.createElement('h6');
    title.classList.add('submenu-title');
    title.textContent = label.textContent;
    col1div.appendChild(title);

    const col3div = document.createElement('div');
    col3div.classList.add('submenu-links2');
    col3div.innerText = 'secondary links menu';

    const col4div = document.createElement('div');
    col4div.classList.add('submenu-feature');
    col4div.innerText = 'submenu section feature';

    wrapper.classList.add('submenu-wrapper');
    wrapper.appendChild(header);
    wrapper.appendChild(col1div);
    wrapper.appendChild(col2div);
    wrapper.appendChild(col3div);
    wrapper.appendChild(col4div);

    navSection.appendChild(wrapper);
    navSection.removeChild(submenu);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // mobile nav header
  const mobileNavHeader = document.createElement('div');
  mobileNavHeader.id = 'mobile-nav-header';
  mobileNavHeader.className = 'container';

  const mobileNavBack = document.createElement('button');
  mobileNavBack.id = 'mobile-nav-back';
  mobileNavBack.innerHTML = `<img src="../icons/chevron-left.svg" height="30" width="30" alt="Back" />`;
  mobileNavBack.addEventListener('click', (e) => {
    e.stopPropagation();

    if (document.querySelector('#nav .active')) {
      const activeNode = document.querySelector('#nav .active');
      const parentCategory = activeNode
        .closest('.section')
        .firstElementChild.querySelector('.nav-link').textContent;
      document.getElementById('mobile-nav-title').innerText =
        parentCategory.replace(/\W+$/gi, '');
      activeNode.classList.remove('active', 'show');
    } else if (document.querySelector('#nav .show')) {
      document.querySelector('#nav .show').classList.remove('show');
      document.getElementById('mobile-nav-title').innerText = '';
      document.getElementById('nav').classList.remove('show-subnav');
    }
  });
  mobileNavHeader.append(mobileNavBack);

  const mobileNavTitle = document.createElement('span');
  mobileNavTitle.id = 'mobile-nav-title';
  mobileNavTitle.innerHTML = ``;
  mobileNavHeader.append(mobileNavTitle);

  const mobileNavClose = document.createElement('button');
  mobileNavClose.id = 'mobile-nav-close';
  mobileNavClose.innerHTML = `<img src="../icons/close.svg" height="30" width="30" alt="Close" />`;
  mobileNavClose.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('header').classList.remove('show-nav');
    document.querySelector('#nav .show').classList.remove('show');
    document.getElementById('mobile-nav-title').innerText = '';
    document.getElementById('nav').classList.remove('show-subnav');
  });
  mobileNavHeader.append(mobileNavClose);

  nav.append(mobileNavHeader);

  const navContainer = document.createElement('div');
  navContainer.classList = 'container nav-sections';
  nav.append(navContainer);

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : '/header/nav';
  const navFragment = await loadFragment(navPath);

  // decorate nav DOM
  while (navFragment.firstElementChild)
    navContainer.append(navFragment.firstElementChild);

  // const classes = ['sections];
  // classes.forEach((c, i) => {
  //   const section = nav.children[i];
  //   if (section) section.classList.add(`nav-${c}`);
  // });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul'))
          navSection.classList.add('nav-drop');
        setupSubmenu(navSection);
        navSection.addEventListener('click', (event) => {
          if (event.target.tagName === 'A') return;
          if (!isDesktop.matches) {
            navSection.classList.toggle('active');
          }
        });
        navSection.addEventListener('mouseenter', () => {
          // toggleAllNavSections(navSections);
          if (isDesktop.matches) {
            if (!navSection.classList.contains('nav-drop')) {
              overlay.classList.remove('show');
              return;
            }
            navSection.setAttribute('aria-expanded', 'true');
            overlay.classList.add('show');
          }
        });
      });
  }

  // set up a grid for organizing the main header content
  const gridContainer = document.createElement('div');
  gridContainer.id = 'header-main';
  gridContainer.className = 'container';

  const gridRow = document.createElement('div');
  gridRow.className = 'row';

  // column 1
  const col1 = document.createElement('div');
  col1.className = 'col';
  col1.id = 'header-logo';

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.id = 'nav-hamburger';
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="p-0 block" width="30" height="30" :class="{ 'hidden' : open, 'block': !open }" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>`;
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('header').classList.toggle('show-nav');
    // nav.classList.toggle('show);
    // overlay.classList.toggle('show);
    // toggleMenu(nav, navSections);
  });
  col1.append(hamburger);

  // load logobar as fragment
  const logoMeta = getMetadata('logo');
  const logoPath = logoMeta
    ? new URL(logoMeta, window.location).pathname
    : '/header/logo';
  const logoFragment = await loadFragment(logoPath);

  // decorate logobar DOM
  const logo = document.createElement('div');
  logo.id = 'logobar';
  logo.className = 'container';

  while (logoFragment.firstElementChild)
    col1.append(logoFragment.firstElementChild);

  const logoClasses = ['brand', 'tools'];
  logoClasses.forEach((c, i) => {
    const section = logo.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // column 2
  const col2 = document.createElement('div');
  col2.className = 'col';
  col2.id = 'header-search';

  // load search as fragment
  const searchMeta = getMetadata('search');
  const searchPath = searchMeta
    ? new URL(searchMeta, window.location).pathname
    : '/header/search';
  const searchFragment = await loadFragment(searchPath);

  col2.appendChild(searchFragment.firstElementChild);

  // column 3
  const col3 = document.createElement('div');
  col3.classList = 'col';
  col3.id = 'header-utilities';

  const searchButtonMarkup = `
  <button id="menu-search-icon" class="rounded p-1 outline-offset-2 block md:hidden" @click.prevent="searchOpen = !searchOpen; $dispatch('search-open');" aria-label="Toggle search form" aria-haspopup="true" :aria-expanded="searchOpen" x-ref="searchButton" x-effect="searchOpen ? document.body.classList.add('searchFormOpen') : document.body.classList.remove('searchFormOpen')" aria-expanded="false">
    <svg class="ico-search" width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_71_2295)">
        <path d="M18.6398 15.9424L18.0997 16.4811L15.8311 14.1652C16.7265 12.7913 17.2508 11.1449 17.2508 9.37448C17.2508 4.59109 13.4389 0.699768 8.75406 0.699768C4.06926 0.699768 0.257324 4.59109 0.257324 9.37448C0.257324 14.1579 4.06889 18.0492 8.75406 18.0492C10.7442 18.0492 12.573 17.3417 14.0226 16.1672L16.1926 18.3826L15.7787 18.795L21.0266 24.2807L23.8874 21.4276L18.6398 15.9424ZM2.9228 9.37448C2.9228 6.09164 5.53843 3.421 8.75406 3.421C11.9697 3.421 14.5853 6.09128 14.5853 9.37448C14.5853 12.6577 11.9697 15.328 8.75406 15.328C5.53843 15.328 2.9228 12.6573 2.9228 9.37448Z" fill="black"></path>
      </g>
      <defs>
        <clipPath id="clip0_71_2295">
          <rect width="24" height="24" fill="white" transform="translate(0 0.505127)"></rect>
        </clipPath>
      </defs>
    </svg>
    <svg class="ico-search-close" width="24" height="23" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_71_2340)">
        <path d="M14.4045 12.2113L16.3688 10.2469C16.93 9.68572 16.9835 8.99083 16.4223 8.42959C15.8611 7.86836 15.1662 7.9219 14.6049 8.48313L12.6406 10.4474L10.6763 8.48313C10.1151 7.9219 9.42021 7.86836 8.85898 8.42959C8.29775 8.99083 8.35128 9.68572 8.91252 10.2469L10.8772 12.2116L8.91289 14.1759C8.35165 14.7372 8.29812 15.4321 8.85935 15.9933C9.42058 16.5545 10.1155 16.501 10.6767 15.9401L12.641 13.9758L14.6057 15.9405C15.1669 16.5017 15.8618 16.5553 16.423 15.994C16.9843 15.4328 16.9307 14.7379 16.3695 14.1767L14.4045 12.2113Z" fill="black"></path>
        <path d="M12.5979 0.52478C6.08278 0.52478 0.782471 5.82509 0.782471 12.3402C0.782471 18.8552 6.08278 24.1555 12.5979 24.1555C19.1129 24.1555 24.4132 18.8552 24.4132 12.3402C24.4132 5.82509 19.1129 0.52478 12.5979 0.52478ZM12.5979 21.9852C7.27945 21.9852 2.95281 17.6582 2.95281 12.3402C2.95281 7.02213 7.27945 2.69512 12.5979 2.69512C17.9163 2.69512 22.2429 7.02176 22.2429 12.3402C22.2429 17.6586 17.9163 21.9852 12.5979 21.9852Z" fill="black"></path>
      </g>
      <defs>
        <clipPath id="clip0_71_2340">
          <rect width="24" height="24" fill="white" transform="translate(0.5979 0.34021)"></rect>
        </clipPath>
      </defs>
    </svg>
  </button>
  `;

  col3.innerHTML = searchButtonMarkup;

  const searchButtonElem = col3.querySelector('#menu-search-icon');

  searchButtonElem.addEventListener('click', (e) => {
    e.stopPropagation();
    const headerSearch = document.getElementById('header-search');
    const searchInput = document.getElementById('search');
    headerSearch.classList.toggle('show');
    searchInput.focus();
  });

  searchButtonElem.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
    }
  });

  // const searchInput = document.getElementById('search);
  // searchInput.addEventListener('keydown, (e) => {
  //   if (e.code === 'Enter) {
  //     const searchForm = document.getElementById('search_mini_form);
  //     searchForm.submit();
  //   }

  //   if (e.code === 'Escape) {
  //     const headerSearch = document.getElementById('header-search);
  //     headerSearch.classList.remove('show);
  //     searchButtonElem.focus();
  //   }
  // });

  // load utilities as fragment
  const utilitiesMeta = getMetadata('utilities');
  const utilitiesPath = utilitiesMeta
    ? new URL(utilitiesMeta, window.location).pathname
    : '/header/utilities';
  const utilitiesFragment = await loadFragment(utilitiesPath);

  [...utilitiesFragment.children].map((child) => {
    col3.appendChild(child);
  });

  gridRow.append(col1, col2, col3);
  gridContainer.appendChild(gridRow);

  // const navBrand = logobar.querySelector('.nav-brand');
  // const brandLink = navBrand.querySelector('.button');
  // if (brandLink) {
  //   brandLink.className = '';
  //   brandLink.closest('.button-container').className = '';
  // }

  // const navTools = logobar.querySelector('.nav-tools');

  // /** Mini Cart */
  // const excludeMiniCartFromPaths = ['/checkout'];

  // const minicart = document.createRange().createContextualFragment(`
  //    <div class="minicart-wrapper nav-tools-wrapper">
  //      <button type="button" class="nav-cart-button" aria-label="Cart">
  //       <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <path d="M15.55 13.9877C16.3 13.9877 16.96 13.5777 17.3 12.9577L20.88 6.46773C21.25 5.80773 20.77 4.98773 20.01 4.98773H5.21L4.27 2.98773H1V4.98773H3L6.6 12.5777L5.25 15.0177C4.52 16.3577 5.48 17.9877 7 17.9877H19V15.9877H7L8.1 13.9877H15.55ZM6.16 6.98773H18.31L15.55 11.9877H8.53L6.16 6.98773ZM7 18.9877C5.9 18.9877 5.01 19.8877 5.01 20.9877C5.01 22.0877 5.9 22.9877 7 22.9877C8.1 22.9877 9 22.0877 9 20.9877C9 19.8877 8.1 18.9877 7 18.9877ZM17 18.9877C15.9 18.9877 15.01 19.8877 15.01 20.9877C15.01 22.0877 15.9 22.9877 17 22.9877C18.1 22.9877 19 22.0877 19 20.9877C19 19.8877 18.1 18.9877 17 18.9877Z" fill="black"></path>
  //       </svg>
  //     </button>
  //      <div class="minicart-panel nav-tools-panel"></div>
  //    </div>
  //  `);

  // logobar.append(minicart);

  // const minicartPanel = header.querySelector('.cart-mini-cart');

  // const cartButton = logobar.querySelector('.nav-cart-button');

  // if (excludeMiniCartFromPaths.includes(window.location.pathname)) {
  //   cartButton.style.display = 'none';
  // }

  // // load nav as fragment
  // const miniCartMeta = getMetadata('mini-cart');
  // const miniCartPath = miniCartMeta
  //   ? new URL(miniCartMeta, window.location).pathname
  //   : '/mini-cart';
  // loadFragment(miniCartPath).then((miniCartFragment) => {
  //   minicartPanel.append(miniCartFragment.firstElementChild);
  // });

  // async function toggleMiniCart(state) {
  //   const show =
  //     state ?? !minicartPanel.classList.contains('nav-tools-panel--show');
  //   const stateChanged =
  //     show !== minicartPanel.classList.contains('nav-tools-panel--show');
  //   minicartPanel.classList.toggle('nav-tools-panel--show', show);

  //   if (stateChanged && show) {
  //     publishShoppingCartViewEvent();
  //   }
  // }

  // cartButton.addEventListener('click', () => toggleMiniCart());

  // // Cart Item Counter
  // events.on(
  //   'cart/data',
  //   (data) => {
  //     if (data?.totalQuantity) {
  //       cartButton.setAttribute('data-count', data.totalQuantity);
  //     } else {
  //       cartButton.removeAttribute('data-count');
  //     }
  //   },
  //   { eager: true }
  // );

  /** Search */

  // // TODO
  // const search = document.createRange().createContextualFragment(`
  // <div class="search-wrapper nav-tools-wrapper">
  //   <button type="button" class="nav-search-button">Search</button>
  //   <div class="nav-search-input nav-search-panel nav-tools-panel">
  //     <form action="/search" method="GET">
  //       <input id="search" type="search" name="q" placeholder="Search" />
  //       <div id="search_autocomplete" class="search-autocomplete"></div>
  //     </form>
  //   </div>
  // </div>
  // `);

  // navTools.append(search);

  // const searchPanel = logobar.querySelector('.nav-search-panel');

  // const searchButton = navTools.querySelector('.nav-search-button');

  // const searchInput = searchPanel.querySelector('input');

  // const searchForm = searchPanel.querySelector('form');

  // searchForm.action = rootLink('/search');

  // async function toggleSearch(state) {
  //   const show = state ?? !searchPanel.classList.contains('nav-tools-panel--show');

  //   searchPanel.classList.toggle('nav-tools-panel--show', show);

  //   if (show) {
  //     await import('./searchbar.js');
  //     searchInput.focus();
  //   }
  // }

  // navTools.querySelector('.nav-search-button').addEventListener('click', () => {
  //   if (isDesktop.matches) {
  //     toggleAllNavSections(navSections);
  //     overlay.classList.remove('show');
  //   }
  //   toggleSearch();
  // });

  // // Close panels when clicking outside
  // document.addEventListener('click', (e) => {
  //   if (!minicartPanel.contains(e.target) && !cartButton.contains(e.target)) {
  //     toggleMiniCart(false);
  //   }

  //   if (!searchPanel.contains(e.target) && !searchButton.contains(e.target)) {
  //     toggleSearch(false);
  //   }
  // });

  // // Close panels when clicking outside
  // document.addEventListener('click', (e) => {
  //   document.querySelectorAll('.show').forEach((el) => {
  //     el.classList.remove('show');
  //   })
  // });

  // header.addEventListener('click', (e) => {
  //   e.stopPropagation();
  // });

  // load Top Bar
  const topBarMeta = getMetadata('topbar');
  const topBarPath = topBarMeta
    ? new URL(topBarMeta, window.location).pathname
    : '/header/topbar';
  const topBarFragment = await loadFragment(topBarPath);
  const topBar = document.createElement('div');
  topBar.id = 'top-bar';
  topBar.className =
    sessionStorage.getItem('headerBannerIsClosed') === 'true' ? 'hide' : '';

  while (topBarFragment.firstElementChild)
    topBar.append(topBarFragment.firstElementChild);
  const paragraphs = topBar.querySelectorAll('p');
  const topBarMarkup = `
  <div class="container">
    <div class="shop-msg dark-header-link">
      ${paragraphs[paragraphs.length - 1].innerHTML}
    </div>
    <div class="close-button absolute right-1.5 md:right-5 xs:right-1.5">
      <button id="close-header-banner" type="button" @click="closeMessageOnClick" class="close-header-message" aria-label="Close Message" title="Close Message">
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" class="" fill="none" viewBox="0 0 18 18" stroke="#ffffff" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M0 17L17 0M0 0l17 17"></path>
          </svg>
      </button>
    </div>
  </div>`;

  topBar.innerHTML = topBarMarkup;

  // load Top Links
  const topLinksMeta = getMetadata('toplinks');
  const topLinksPath = topLinksMeta
    ? new URL(topLinksMeta, window.location).pathname
    : '/header/toplinks';
  const topLinksFragment = await loadFragment(topLinksPath);

  // decorate the list elements with data-name attributes for specific styling
  [...topLinksFragment.querySelectorAll('li')].map((elem) => {
    const linkTitle = elem.textContent;
    elem.setAttribute('data-name', linkTitle.toLowerCase());
  });

  const topLinks = document.createElement('div');
  topLinks.id = 'top-links';
  topLinks.className = 'top-links';

  const topLinksContainer = document.createElement('div');
  topLinksContainer.className = 'container';

  let toplinksSections = '';

  if (customerType === 'Employee') {
    document.body.classList.add('employee');
    // build the top-links bar for employees
    const sessionNumber = 6;
    toplinksSections = `
    <ul>
      <li id="store-locator-container">
        <label aria-label-for="store-locator-input" id="store-locator-label">STORE</label>
        <input type="text" id="store-locator-input" placeholder="zip code" />
      </li>
      <li id="session-container">
        <span id="session-text">${sessionNumber}: SESSION ${sessionNumber}</span>
      </li>
      <li id="pros-link-container">
        <a href="/pros" id="pros-link">PROS</a>
      </li>
    </ul>
  `;
    topLinksContainer.innerHTML = toplinksSections;
  } else {
    while (topLinksFragment.firstElementChild)
      topLinks.append(topLinksFragment.firstElementChild);
    toplinksSections = topLinks.querySelector('ul');
    topLinksContainer.innerHTML = toplinksSections.outerHTML;
  }
  topLinks.innerHTML = topLinksContainer.outerHTML;

  // clear all fragments
  block.innerHTML = '';

  // place compiled elements in the header
  block.append(topBar, topLinks, gridContainer, nav);

  nav.addEventListener('mouseout', (e) => {
    if (isDesktop.matches && !nav.contains(e.relatedTarget)) {
      // toggleAllNavSections(navSections);
      overlay.classList.remove('show');
    }
  });

  document.addEventListener('resize', () => {
    nav.classList.remove('active');
    overlay.classList.remove('show');
    // toggleMenu(nav, navSections, false);
  });

  // nav.setAttribute('aria-expanded', 'false');
  // // prevent mobile nav behavior on window resize
  // // toggleMenu(nav, navSections, isDesktop.matches);
  // isDesktop.addEventListener('change', () =>
  //   // toggleMenu(nav, navSections, isDesktop.matches)
  // );

  // renderAuthCombine(
  //   navTools,
  //   () => !isDesktop.matches && toggleMenu(logobar, navTools, false)
  // );
  // renderAuthDropdown(navTools);

  document.getElementById('top-bar').addEventListener('click', (e) => {
    if (e.target.parentElement.id === 'close-header-banner') {
      e.preventDefault();
      const topBar = document.getElementById('top-bar');
      topBar.classList.add('hide');
      measureStickyPosition();
      sessionStorage.setItem('headerBannerIsClosed', 'true');
    }
  });

  // handle all nav links
  document.getElementById('nav').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.tagName === 'A') {
      if (isMobile()) {
        if (e.target.classList.contains('nav-link')) {
          document.getElementById('nav').classList.add('show-subnav');
          e.target.closest('.show').classList.add('show');
        }

        if (e.target.parentElement.classList.contains('nav-drop')) {
          // if top level link
          e.target.parentElement.classList.add('show');
        } else if (e.target.parentElement.querySelector('ul')) {
          // if submenu link
          e.target.parentElement.classList.add('show');
        } else {
          // if child link with no submenu
          location.href = e.target.href;
        }

        const nestedList = e.target.parentElement.querySelector('ul');
        document.getElementById('mobile-nav-title').innerText =
          e.target.innerText.replace(/\W+$/gi, '');

        if (nestedList) {
          e.target.parentElement.classList.add('show', 'active');
        }
      } else {
        location.href = e.target.href;
      }
    }
  });
}

events.on(
  'cart/initialized',
  () => {
    applyHashTagsForDomElement('nav');
  },
  { eager: true }
);

events.on(
  'cart/updated',
  () => {
    applyHashTagsForDomElement('nav');
  },
  { eager: true }
);

events.on(
  'cart/reset',
  () => {
    applyHashTagsForDomElement('nav');
  },
  { eager: true }
);

document.addEventListener('DOMContentLoaded', (e) => {
  measureStickyPosition();

  const minicartPanel = header.querySelector('.cart-mini-cart');

  // Close panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!minicartPanel.contains(e.target) && !cartButton.contains(e.target)) {
      toggleMiniCart(false);
    }

    if (!searchPanel.contains(e.target) && !searchButton.contains(e.target)) {
      toggleSearch(false);
    }
  });

  document.querySelectorAll('.submenu-wrapper a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
});

// Add a buffer to prevent rapid toggling near the cutoff
const STICKY_BUFFER = 10; // px

let lastScrollY = window.scrollY;
let scrollTimeout = null;

document.addEventListener('scroll', () => {
  // Debounce the scroll handler
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const headerNav = document.getElementById('nav');
    const { scrollY } = window;

    // Add hysteresis: only collapse if well past cutoff, only expand if well above
    if (headerIsCollapsed) {
      if (scrollY < stickyCutoffPosition - STICKY_BUFFER) {
        // Only move if not already in the correct container
        if (headerNav.parentElement !== headerBlock) {
          if (!isMobile()) {
            headerBlock.appendChild(headerNav);
            header.classList.remove('collapsed');
            headerIsCollapsed = false;
          }
          measureStickyPosition();
        }
      }
    } else if (scrollY > stickyCutoffPosition + STICKY_BUFFER) {
      const headerSearch = document.getElementById('header-search');
      if (headerNav.parentElement !== headerSearch) {
        if (!isMobile()) {
          headerSearch.append(headerNav);
          header.classList.add('collapsed');
          headerIsCollapsed = true;
        }
        measureStickyPosition();
      }
    }
    lastScrollY = scrollY;
  }, 50); // Adjust debounce delay as needed
});

// close any open panels on click outside
document.addEventListener('click', (e) => {
  closeAllPanels();
  document.querySelector('header').classList.remove('show-nav');
});
