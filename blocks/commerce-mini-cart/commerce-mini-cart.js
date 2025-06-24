import { render as provider } from '@dropins/storefront-cart/render.js';
import MiniCart from '@dropins/storefront-cart/containers/MiniCart.js';

// Initializers
import '../../scripts/initializers/cart.js';
import { readBlockConfig } from '../../scripts/aem.js';
import { rootLink } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const {
    'start-shopping-url': startShoppingURL = '',
    'cart-url': cartURL = '',
    'checkout-url': checkoutURL = '',
  } = readBlockConfig(block);

  block.innerHTML = '';

  const miniCartContainer = document.createElement('div');
  miniCartContainer.id = 'mini-cart-container';

  const cartButton = document.createElement('button');
  cartButton.id = 'menu-cart-icon';
  cartButton.setAttribute('aria-disabled', 'true');
  cartButton.setAttribute('aria-label', 'Toggle minicart, Cart is empty');
  cartButton.setAttribute('aria-expanded', 'false');
  cartButton.setAttribute('aria-haspopup', 'dialog');
  cartButton.innerHTML = `
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.55 13.9877C16.3 13.9877 16.96 13.5777 17.3 12.9577L20.88 6.46773C21.25 5.80773 20.77 4.98773 20.01 4.98773H5.21L4.27 2.98773H1V4.98773H3L6.6 12.5777L5.25 15.0177C4.52 16.3577 5.48 17.9877 7 17.9877H19V15.9877H7L8.1 13.9877H15.55ZM6.16 6.98773H18.31L15.55 11.9877H8.53L6.16 6.98773ZM7 18.9877C5.9 18.9877 5.01 19.8877 5.01 20.9877C5.01 22.0877 5.9 22.9877 7 22.9877C8.1 22.9877 9 22.0877 9 20.9877C9 19.8877 8.1 18.9877 7 18.9877ZM17 18.9877C15.9 18.9877 15.01 19.8877 15.01 20.9877C15.01 22.0877 15.9 22.9877 17 22.9877C18.1 22.9877 19 22.0877 19 20.9877C19 19.8877 18.1 18.9877 17 18.9877Z" fill="black"></path>
  </svg>
  <span x-text="cart.summary_count" x-show="!isCartEmpty()" class="absolute -top-1.5 -right-1 h-5 px-1.5 py-1 rounded-full bg-primary text-white ßtext-xs font-semibold leading-none text-center uppercase tabular-nums" aria-hidden="true" style="display: none;">0</span>
  `;
  cartButton.addEventListener('click', (e) => {
    miniCartContainer.classList.toggle('open');
  });

  block.appendChild(cartButton);
  block.appendChild(miniCartContainer);

  return provider.render(MiniCart, {
    routeEmptyCartCTA: startShoppingURL
      ? () => rootLink(startShoppingURL)
      : undefined,
    routeCart: cartURL ? () => rootLink(cartURL) : undefined,
    routeCheckout: checkoutURL ? () => rootLink(checkoutURL) : undefined,
    routeProduct: (product) =>
      rootLink(`/products/${product.url.urlKey}/${product.topLevelSku}`),
  })(miniCartContainer);
}
