const BASE_URL = '/shop/';

const privateContentKey = 'mage-cache-storage';
const privateContentExpireKey = 'mage-cache-timeout';
const privateContentVersionKey = 'private_content_version';
const sectionDataIdsKey = 'section_data_ids';
const mageCacheSessionIdKey = 'mage-cache-sessid';

const ttl = 3600;

function getCookie(name) {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}

function lifetimeToExpires(options, defaults) {
  const lifetime = options.lifetime || defaults.lifetime;

  if (lifetime) {
    const date = new Date();
    date.setTime(date.getTime() + lifetime * 1000);
    return date;
  }

  return null;
}

function setCookie(name, value, days, skipSetDomain) {
  const defaultCookieConfig = {
    expires: null,
    path: '/',
    domain: null,
    secure: false,
    lifetime: null,
    samesite: 'lax',
  };

  const cookieConfig = window.COOKIE_CONFIG || {};

  const expires = lifetimeToExpires(
    {
      lifetime: 24 * 60 * 60 * days,
      expires: null,
    },
    defaultCookieConfig
  );

  const path = cookieConfig.path || defaultCookieConfig.path;
  const domain =
    !skipSetDomain && (cookieConfig.domain || defaultCookieConfig.domain);
  const secure = cookieConfig.secure || defaultCookieConfig.secure;
  const samesite = cookieConfig.samesite || defaultCookieConfig.samesite;

  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (expires) {
    parts.push(`expires=${expires.toGMTString()}`);
  }
  if (path) {
    parts.push(`path=${path}`);
  }
  if (domain) {
    parts.push(`domain=${domain}`);
  }
  if (secure) {
    parts.push('secure');
  }
  parts.push(`samesite=${samesite || 'lax'}`);

  document.cookie = parts.join('; ');
}

function generateRandomString() {
  const allowedCharacters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = 16;
  let str = '';

  for (let i = 0; i < length; i += 1) {
    str +=
      allowedCharacters[
        Math.round(Math.random() * (allowedCharacters.length - 1))
      ];
  }

  return str;
}

function getEDSMiniCartBlock() {
  return document.querySelector('[data-block-name=minicart]');
}

function getCartDrawerContainer() {
  return getEDSMiniCartBlock().querySelector('[role=dialog]');
}

function hideCartDrawer() {
  const container = getCartDrawerContainer();
  const backdrop = container.querySelector('.backdrop');
  if (backdrop) {
    backdrop.classList.add('hidden', 'opacity-0');
    backdrop.classList.remove('opacity-100');
  }
  const drawer = container.querySelector('[aria-label="My Cart"]');
  if (drawer) {
    drawer.classList.add('hidden');
    drawer.classList.remove('is-open');
  }
}

function showCartDrawer() {
  const container = getCartDrawerContainer();
  const backdrop = container.querySelector('.backdrop');
  if (backdrop) {
    backdrop.classList.remove('hidden', 'opacity-0');
    backdrop.classList.add('opacity-100');
  }
  const drawer = container.querySelector('[aria-label="My Cart"]');
  if (drawer) {
    drawer.classList.remove('hidden');
    drawer.classList.add('is-open');
  }
}

function getCartData() {
  if (!getCookie(mageCacheSessionIdKey)) {
    localStorage.removeItem(privateContentKey);
  }
  const cookieVersion = getCookie(privateContentVersionKey);
  const storageVersion = localStorage.getItem(privateContentVersionKey);
  if ((cookieVersion && !storageVersion) || cookieVersion !== storageVersion) {
    localStorage.removeItem(privateContentKey);
  }
  const privateContentExpires = localStorage.getItem(privateContentExpireKey);
  if (privateContentExpires && new Date(privateContentExpires) < new Date()) {
    localStorage.removeItem(privateContentKey);
  }

  const data = JSON.parse(localStorage.getItem(privateContentKey) || '{}');
  return (data && data.cart) || {};
}

function addItemsTo(container) {
  const itemsWrapper = document.createElement('div');
  itemsWrapper.classList.add(
    'relative',
    'grid',
    'gap-6',
    'sm:gap-8',
    'px-1',
    'py-3',
    'sm:px-3',
    'bg-white',
    'border-b',
    'border-container',
    'overflow-y-auto',
    'overscroll-y-contain'
  );
  (getCartData().items || []).forEach((item) => {
    const itemDiv = document.createElement('div');
    const options = (item.options || []).map((option) => {
      const optionDiv = document.createElement('div');
      optionDiv.classList.add('pt-2');
      optionDiv.innerHTML = `<p class="font-semibold">${option.label}:</p><p class="text-secondary">${option.value}</p>`;
      return optionDiv.outerHTML;
    });
    let configureButton = '';
    if (item.product_type !== 'grouped' && item.is_visible_in_site_visibility) {
      configureButton = `
      <a href="${item.configure_url}" class="inline-flex p-2 mr-2 btn btn-primary" aria-label="Edit product ${item.product_name}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
      </a>`;
    }
    itemDiv.innerHTML = `
    <div class="flex items-start p-3 space-x-4 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100">
      <a href="${item.product_url}" class="w-1/4" aria-label="Product ${
      item.product_name
    }">
        <img src="${item.product_image.src}" width="${
      item.product_image.width
    }" height="${item.product_image.height}" loading="lazy" alt="Image of ${
      item.product_name
    }">
      </a>
      <div class="w-3/4 space-y-2">
        <div>
          <p class="text-xl">${item.qty} x ${item.product_name}</p>
          <p class="text-sm">${item.product_sku}</p>
        </div>
        ${options.join('')}
        <p>${item.product_price}</p>
        <div class="pt-4">
          ${configureButton}
          <button type="button" class="inline-flex p-2 btn btn-primary" data-item-id="${
            item.item_id
          }" aria-label="Remove product ${
      item.product_name
    }" onclick="deleteItemFromCart(this.dataset.itemId, '${
      item.product_name
    }')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
    itemsWrapper.append(itemDiv);
  });

  container.append(itemsWrapper);
}

function renderMinicartContentInto(minicart) {
  const cart = getCartData();
  const itemsContainer = document.createElement('div');
  const totalsAndCheckoutContainer = document.createElement('div');
  if (!cart || !cart.items) {
    itemsContainer.innerHTML = `
    <div class="relative px-4 py-6 bg-white border-bs sm:px-6 border-container">
      Cart is empty
    </div>`;
  } else {
    addItemsTo(itemsContainer);
    totalsAndCheckoutContainer.innerHTML = `
    <div class="relative grid gap-6 sm:gap-8 py-3 px-1 sm:px-3 bg-white">
      <div class="w-full p-3 space-x-4 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100">
        <p>Subtotal: <span>${cart.subtotal}</span></p>
      </div>
      <div class="w-full p-3 space-x-4 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100">
        <a href="${BASE_URL}checkout/" class="inline-flex btn btn-primary">Checkout</a>
        <span>or</span>
        <a href="${BASE_URL}checkout/cart/" class="underline">View and Edit Cart</a>
      </div>
    </div>`;
  }

  minicart.innerHTML = `
    <div role="dialog" aria-labelledby="cart-drawer-title" aria-modal="true" class="fixed inset-y-0 right-0 z-30 flex max-w-full">
      <div class="backdrop opacity-0 hidden" role="button" aria-label="Close minicart"></div>
        <div class="dialog hidden relative w-screen max-w-md shadow-2xl" role="region" aria-label="My Cart" tabindex="0">
          <div class="flex flex-col h-full max-h-screen bg-white shadow-xl">
            <header class="relative px-4 py-6 sm:px-6">
              <p id="cart-drawer-title" class="text-lg font-medium leading-7 text-gray-900">
                <strong>My Cart</strong>
              </p>
            </header>
            ${itemsContainer.innerHTML}
            ${totalsAndCheckoutContainer.innerHTML}
          </div>
          <button type="button" aria-label="Close minicart" class="absolute top-0 right-2 btn p-4 mt-2 bg-transparent text-gray-300 hover:text-black hover:bg-transparent shadow-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="24" height="24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div id="cartLoader" hidden class="z-50 fixed inset-0 grid place-content-center bg-white/70 select-none text-primary">
          <svg viewBox="0 0 57 57" width="57" height="57" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
            <style>
                @keyframes spinner-ball-triangle1 {
                    0% { transform: translate(0%, 0%); }
                    33% { transform: translate(38%, -79%); }
                    66% { transform: translate(77%, 0%); }
                    100% { transform: translate(0%, 0%); }
                }

                @keyframes spinner-ball-triangle2 {
                    0% { transform: translate(0%, 0%); }
                    33% { transform: translate(38%, 79%); }
                    66% { transform: translate(-38%, 79%); }
                    100% { transform: translate(0%, 0%); }
                }

                @keyframes spinner-ball-triangle3 {
                    0% { transform: translate(0%, 0%); }
                    33% { transform: translate(-77%, 0%); }
                    66% { transform: translate(-38%, -79%); }
                    100% { transform: translate(0%, 0%); }
                }
            </style>
            <circle cx="5" cy="50" r="5" style="animation: spinner-ball-triangle1 2.2s linear infinite"/>
            <circle cx="27" cy="5" r="5" style="animation: spinner-ball-triangle2 2.2s linear infinite"/>
            <circle cx="49" cy="50" r="5" style="animation: spinner-ball-triangle3 2.2s linear infinite"/>
          </svg>
        </div>
      </div>
    </div>`;

  minicart.querySelector('.backdrop').addEventListener('click', hideCartDrawer);
  minicart
    .querySelector('button[aria-label="Close minicart"]')
    .addEventListener('click', hideCartDrawer);
}

function getMiniCartButton() {
  return document.querySelector('#nav .icon-shopping-cart');
}

function updateMinicartCounter() {
  const miniCartButton = getMiniCartButton();
  const cart = getCartData();
  const oldCounter = document.getElementById('minicart-counter');
  if (oldCounter) {
    oldCounter.remove();
  }
  if (miniCartButton && cart && cart.items && cart.summary_count) {
    const counter = document.createElement('span');
    counter.classList.add(
      'absolute',
      '-top-1.5',
      '-right-1.5',
      'h-5',
      'px-2',
      'py-1',
      'rounded-full',
      'bg-primary',
      'text-white',
      'text-xs',
      'font-semibold',
      'leading-none',
      'text-center',
      'uppercase',
      'tabular-nums'
    );
    counter.setAttribute('aria-hidden', 'true');
    counter.setAttribute('id', 'minicart-counter');
    miniCartButton.parentElement.append(counter);
    counter.innerText = cart.summary_count;
  }
}

function reRenderMinicart() {
  const block = getEDSMiniCartBlock();
  renderMinicartContentInto(block);
  updateMinicartCounter();
}

function showCartLoader() {
  const loader = document.getElementById('cartLoader');
  if (!loader) return;
  loader.removeAttribute('hidden');
}

function hideCartLoader() {
  const loader = document.getElementById('cartLoader');
  if (!loader) return;
  loader.setAttribute('hidden', '');
}

function fetchPrivateContent() {
  return fetch(
    `${BASE_URL}customer/section/load/?sections=${encodeURIComponent('')}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        return {};
      }

      try {
        const browserStorage = window.localStorage;

        // merge new data preserving non-invalidated sections
        const oldSectionData =
          JSON.parse(browserStorage.getItem(privateContentKey) || '{}') || {};

        if (
          (!data.cart || !data.cart.cartId) &&
          oldSectionData['checkout-data']
        ) {
          delete oldSectionData['checkout-data'];
        }
        const newSectionData = Object.assign(oldSectionData, data);

        // don't persist messages, they've been dispatched already
        if (newSectionData.messages && newSectionData.messages.messages) {
          if (window.displayMessage) {
            newSectionData.messages.messages.map(window.displayMessage);
          } else {
            console.error(
              'Unable to display messages:',
              newSectionData.messages.messages
            );
          }
          newSectionData.messages.messages = [];
        }

        browserStorage.setItem(
          privateContentKey,
          JSON.stringify(newSectionData)
        );

        const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
        browserStorage.setItem(privateContentExpireKey, expiresAt);

        const newCookieVersion = getCookie(privateContentVersionKey);
        browserStorage.setItem(privateContentVersionKey, newCookieVersion);

        // We don't need the section_data_ids in Hyvä, but we store them for compatibility
        // with Luma Fallback. Otherwise, not all sections are loaded in Luma Checkout
        const sectionDataIds = Object.keys(data).reduce((acc, sectionKey) => {
          acc[sectionKey] = data[sectionKey].data_id;
          return acc;
        }, {});
        setCookie(
          sectionDataIdsKey,
          JSON.stringify(sectionDataIds),
          false,
          true
        );

        return newSectionData;
      } catch (error) {
        console.warn("Couldn't store privateContent", error);
        return {};
      }
    });
}

window.deleteItemFromCart = function deleteItemFromCart(itemId, itemName) {
  showCartLoader();
  const formKey = getCookie('form_key') || generateRandomString(16);
  const postUrl = `${BASE_URL}checkout/sidebar/removeItem/`;
  fetch(postUrl, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `form_key=${formKey}&item_id=${itemId}`,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
        return {};
      }
      if (response.ok) {
        return response.json();
      }

      window.displayMessage({
        type: 'warning',
        text: 'Could not remove item from quote.',
      });
      hideCartLoader();
      return {};
    })
    .then((result) => {
      if (result.success) {
        window.displayMessage({
          type: 'success',
          text: `You removed the item ${itemName || itemId}.`,
        });
        hideCartLoader();
      } else if (result.error_message) {
        window.displayMessage({ type: 'error', text: result.error_message });
        hideCartLoader();
      }
    })
    .then(async () => {
      await fetchPrivateContent();
      reRenderMinicart();
    });
};

function activateMinicartButton() {
  const miniCartButton = getMiniCartButton();
  if (miniCartButton) {
    miniCartButton.addEventListener('click', showCartDrawer);
    miniCartButton.classList.add('btn', 'btn-flat', 'p-1');
    miniCartButton.parentElement.classList.add('relative');
    updateMinicartCounter();
  } else {
    setTimeout(activateMinicartButton, 333);
  }
  return miniCartButton;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  if (!window.localStorage) {
    window.displayMessage({
      type: 'error',
      text: 'Browser LocalStorage not available.',
    });
    console.error('Browser LocalStorage not available.');
    return;
  }

  const minicart = document.createElement('div');
  renderMinicartContentInto(minicart);

  block.append(minicart);

  activateMinicartButton();
}
