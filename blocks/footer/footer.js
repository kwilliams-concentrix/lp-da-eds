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
import {  getCustomerType } from '../../scripts/helper/customer.js';

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
  // load copyright as fragment
  const copyrightMeta = getMetadata('copyright');
  const copyrightPath = copyrightMeta ? new URL(copyrightMeta, window.location).pathname : '/footer/copyright';
  const copyrightFragment = await loadFragment(copyrightPath);
  const copyright = document.createElement('div');
  copyright.id = 'copyright';

  while (copyrightFragment.firstElementChild) copyright.append(copyrightFragment.firstElementChild);
  const copyrightParagraph = copyright.querySelectorAll('p');

  // load bottomMessage as fragment
  const bottomMessageMeta = getMetadata('bottomMessage');
  const bottomMessagePath = bottomMessageMeta ? new URL(bottomMessageMeta, window.location).pathname : '/footer/bottommessage';
  const bottomMessageFragment = await loadFragment(bottomMessagePath);
  const bottomMessage = document.createElement('div');
  bottomMessage.id = 'bottomMessage';

  while (bottomMessageFragment.firstElementChild) {
    bottomMessage.append(bottomMessageFragment.firstElementChild);
  }
  const bottomMessageParagraph = bottomMessage.querySelectorAll('p');

  // load footerLinks as fragment
  const footerLinksMeta = getMetadata('footerLinks');
  const footerLinksPath = footerLinksMeta ? new URL(footerLinksMeta, window.location).pathname : '/footer/footerlinks';
  const footerLinksFragment = await loadFragment(footerLinksPath);
  const footerLinks = document.createElement('div');
  footerLinks.id = 'footerLinks';

  // load dropdownLinks as fragment
  const dropdownLinksMeta = getMetadata('dropdownLinks');
  const dropdownLinksPath = dropdownLinksMeta ? new URL(dropdownLinksMeta, window.location).pathname : '/footer/dropdownlinks';
  const dropdownLinksFragment = await loadFragment(dropdownLinksPath);
  const dropdownLinks = document.createElement('div');
  dropdownLinks.id = 'dropdownLinks';

  while (dropdownLinksFragment.firstElementChild) {
    dropdownLinks.append(dropdownLinksFragment.firstElementChild);
  }

  let dropdownLinksHTML = '';
  dropdownLinks.childNodes.forEach((child) => {
    const dropdownLinksHeader = child.querySelector('h3').outerHTML;
    const dropdownLinksList = child.querySelector('ul').outerHTML;
    const dropdownMarkup = `<div class="column">
              <div class="dropdown-header">
                ${dropdownLinksHeader}
                <span class="plus-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                </span>
                <span class="minus-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
                        <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </span>
                </div>
                <div class="dropdown-content">
                ${dropdownLinksList}
                </div>
              </div>
`;
    dropdownLinksHTML += dropdownMarkup;
  });

  while (footerLinksFragment.firstElementChild) {
    footerLinks.append(footerLinksFragment.firstElementChild);
  }
  const footerLinksList = footerLinks.querySelectorAll('a');
  let footerLinksHTML = '';
  footerLinksList.forEach((link) => {
    link.classList.add('copyright-link');
    footerLinksHTML += link.outerHTML;
  });

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer', 'content');

  const newsletterSignupHTML = `
<div class="page-bottom-border">
  <div class="page-bottom container">
    <div class="left-column">
        <div class="newsletter-form-container">
            <form class="form subscribe" action="/newsletter/subscriber/new/" method="post" id="newsletter-validate-detail" aria-label="Subscribe to Newsletter">
                <h2 id="footer-newsletter-heading"> Stay Connected Via Email </h2>
                <p class="content-text"> Get great offers and inspiration </p>
                <div class="input-container">
                    <label for="newsletter-subscribe" class=""> Enter Your Email Address </label>
                    <input name="email" type="email" required="" id="newsletter-subscribe" class="form-input inline-flex w-full" placeholder="Email Address" aria-describedby="footer-newsletter-heading" style="background-size: auto, 25px; background-image: none, url(&quot;data:image/svg+xml;utf8,
\t\t\t\t\t\t<svg width='26' height='28' viewBox='0 0 26 28' fill='none'
\t\t\t\t\t\t\txmlns='http://www.w3.org/2000/svg'>
\t\t\t\t\t\t\t<path d='M23.8958 6.1084L13.7365 0.299712C13.3797 0.103027 12.98 0 12.5739 0C12.1678 0 11.7682 0.103027 11.4113 0.299712L1.21632 6.1084C0.848276 6.31893 0.54181 6.62473 0.328154 6.99462C0.114498 7.36452 0.00129162 7.78529 7.13608e-05 8.21405V19.7951C-0.00323007 20.2248 0.108078 20.6474 0.322199 21.0181C0.53632 21.3888 0.845275 21.6938 1.21632 21.9008L11.3756 27.6732C11.7318 27.8907 12.1404 28.0037 12.556 27.9999C12.9711 27.9989 13.3784 27.8861 13.7365 27.6732L23.8958 21.9008C24.2638 21.6903 24.5703 21.3845 24.7839 21.0146C24.9976 20.6447 25.1108 20.2239 25.112 19.7951V8.21405C25.1225 7.78296 25.0142 7.35746 24.7994 6.98545C24.5845 6.61343 24.2715 6.30969 23.8958 6.1084Z' fill='url(%23paint0_linear_714_179)'/>
\t\t\t\t\t\t\t<path d='M5.47328 17.037L4.86515 17.4001C4.75634 17.4613 4.66062 17.5439 4.58357 17.643C4.50652 17.7421 4.4497 17.8558 4.4164 17.9775C4.3831 18.0991 4.374 18.2263 4.38963 18.3516C4.40526 18.4768 4.44531 18.5977 4.50743 18.707C4.58732 18.8586 4.70577 18.9857 4.85046 19.0751C4.99516 19.1645 5.16081 19.2129 5.33019 19.2153C5.49118 19.2139 5.64992 19.1767 5.79522 19.1064L6.40335 18.7434C6.51216 18.6822 6.60789 18.5996 6.68493 18.5004C6.76198 18.4013 6.8188 18.2876 6.8521 18.166C6.8854 18.0443 6.8945 17.9171 6.87887 17.7919C6.86324 17.6666 6.82319 17.5458 6.76107 17.4364C6.70583 17.3211 6.62775 17.2185 6.53171 17.1352C6.43567 17.0518 6.32374 16.9895 6.20289 16.952C6.08205 16.9145 5.95489 16.9027 5.82935 16.9174C5.70382 16.932 5.5826 16.9727 5.47328 17.037ZM9.19357 14.8951L7.94155 15.6212C7.83273 15.6824 7.73701 15.7649 7.65996 15.8641C7.58292 15.9632 7.52609 16.0769 7.49279 16.1986C7.4595 16.3202 7.4504 16.4474 7.46603 16.5726C7.48166 16.6979 7.5217 16.8187 7.58383 16.9281C7.66371 17.0797 7.78216 17.2068 7.92686 17.2962C8.07155 17.3856 8.23721 17.434 8.40658 17.4364C8.56757 17.435 8.72631 17.3978 8.87162 17.3275L10.1236 16.6014C10.2325 16.5402 10.3282 16.4576 10.4052 16.3585C10.4823 16.2594 10.5391 16.1457 10.5724 16.024C10.6057 15.9024 10.6148 15.7752 10.5992 15.6499C10.5835 15.5247 10.5435 15.4038 10.4814 15.2944C10.4261 15.1791 10.348 15.0766 10.252 14.9932C10.156 14.9099 10.044 14.8475 9.92318 14.8101C9.80234 14.7726 9.67518 14.7608 9.54964 14.7754C9.42411 14.7901 9.30289 14.8308 9.19357 14.8951ZM14.2374 13.1198C14.187 13.0168 14.1167 12.9251 14.0307 12.8503C13.9446 12.7754 13.8446 12.7189 13.7366 12.6842V5.38336C13.7371 5.2545 13.7124 5.12682 13.6641 5.00768C13.6157 4.88854 13.5446 4.78029 13.4548 4.68917C13.365 4.59806 13.2583 4.52587 13.1409 4.47678C13.0235 4.42769 12.8977 4.40266 12.7708 4.40314C12.6457 4.40355 12.522 4.42946 12.407 4.47933C12.292 4.52919 12.188 4.602 12.1013 4.69343C12.0145 4.78485 11.9467 4.89304 11.902 5.01156C11.8572 5.13007 11.8364 5.25651 11.8407 5.38336V12.7168C11.7327 12.7516 11.6327 12.8081 11.5466 12.883C11.4606 12.9578 11.3903 13.0495 11.3399 13.1525C11.2727 13.2801 11.2346 13.4213 11.2284 13.5659C11.2222 13.7104 11.2481 13.8545 11.3041 13.9875C11.2481 14.1205 11.2222 14.2646 11.2284 14.4091C11.2346 14.5536 11.2727 14.6949 11.3399 14.8225C11.3903 14.9255 11.4606 15.0172 11.5466 15.092C11.6327 15.1669 11.7327 15.2233 11.8407 15.2581V22.5916C11.8407 22.8516 11.9425 23.1009 12.1236 23.2847C12.3047 23.4686 12.5504 23.5718 12.8065 23.5718C13.0627 23.5718 13.3084 23.4686 13.4895 23.2847C13.6706 23.1009 13.7724 22.8516 13.7724 22.5916V15.2218C13.8804 15.187 13.9804 15.1305 14.0664 15.0557C14.1525 14.9809 14.2228 14.8892 14.2732 14.7862C14.3404 14.6586 14.3785 14.5173 14.3847 14.3728C14.3909 14.2283 14.365 14.0842 14.309 13.9512C14.3917 13.6751 14.3661 13.3772 14.2374 13.1198ZM16.6735 10.6112L15.4215 11.3373C15.3127 11.3985 15.2169 11.481 15.1399 11.5802C15.0628 11.6793 15.006 11.793 14.9727 11.9147C14.9394 12.0363 14.9303 12.1635 14.946 12.2887C14.9616 12.414 15.0016 12.5348 15.0638 12.6442C15.1436 12.7958 15.2621 12.9229 15.4068 13.0123C15.5515 13.1017 15.7171 13.1501 15.8865 13.1525C16.0475 13.1511 16.2062 13.1139 16.3515 13.0436L17.6036 12.3175C17.7124 12.2563 17.8081 12.1737 17.8851 12.0746C17.9622 11.9755 18.019 11.8617 18.0523 11.7401C18.0856 11.6184 18.0947 11.4913 18.0791 11.366C18.0635 11.2408 18.0234 11.1199 17.9613 11.0105C17.906 10.8952 17.828 10.7927 17.7319 10.7093C17.6359 10.626 17.524 10.5636 17.4031 10.5261C17.2823 10.4887 17.1551 10.4769 17.0296 10.4915C16.904 10.5061 16.7828 10.5469 16.6735 10.6112ZM19.639 10.9742C19.8 10.9728 19.9587 10.9357 20.104 10.8653L20.7122 10.5023C20.8208 10.4406 20.9164 10.3578 20.9935 10.2586C21.0705 10.1593 21.1275 10.0456 21.1611 9.92394C21.1947 9.80228 21.2043 9.67508 21.1893 9.54965C21.1744 9.42421 21.1351 9.30302 21.0739 9.19302C21.0126 9.08303 20.9305 8.9864 20.8324 8.90869C20.7342 8.83098 20.6219 8.77372 20.5019 8.7402C20.3818 8.70667 20.2564 8.69755 20.1329 8.71335C20.0094 8.72915 19.8902 8.76957 19.7821 8.83227L19.174 9.19531C19.0651 9.25651 18.9694 9.33909 18.8924 9.43822C18.8153 9.53735 18.7585 9.65106 18.7252 9.77271C18.6919 9.89436 18.6828 10.0215 18.6984 10.1468C18.7141 10.272 18.7541 10.3929 18.8162 10.5023C18.8981 10.6494 19.018 10.7711 19.163 10.8543C19.308 10.9374 19.4725 10.9789 19.639 10.9742ZM20.7122 17.4001L20.104 17.037C19.8859 16.9133 19.6284 16.8823 19.3878 16.9508C19.1472 17.0193 18.9432 17.1816 18.8202 17.4024C18.6973 17.6231 18.6655 17.8843 18.7318 18.1288C18.798 18.3733 18.957 18.5812 19.174 18.707L19.7821 19.0701C19.9274 19.1404 20.0861 19.1776 20.2471 19.179C20.4165 19.1766 20.5821 19.1282 20.7268 19.0388C20.8715 18.9494 20.99 18.8223 21.0699 18.6707C21.1339 18.5648 21.1755 18.4466 21.1921 18.3235C21.2087 18.2003 21.1999 18.0751 21.1662 17.9556C21.1326 17.8361 21.0749 17.7251 20.9967 17.6294C20.9185 17.5338 20.8216 17.4557 20.7122 17.4001ZM17.6 15.6212L16.348 14.8951C16.2399 14.8324 16.1207 14.792 15.9971 14.7762C15.8736 14.7604 15.7482 14.7695 15.6282 14.803C15.5082 14.8365 15.3958 14.8938 15.2977 14.9715C15.1995 15.0492 15.1174 15.1458 15.0562 15.2558C14.9949 15.3658 14.9557 15.487 14.9407 15.6125C14.9257 15.7379 14.9353 15.8651 14.9689 15.9868C15.0026 16.1084 15.0595 16.2221 15.1366 16.3214C15.2136 16.4206 15.3092 16.5035 15.4179 16.5651L16.6699 17.2912C16.8152 17.3615 16.974 17.3987 17.135 17.4001C17.3043 17.3977 17.47 17.3493 17.6147 17.2599C17.7594 17.1705 17.8778 17.0434 17.9577 16.8918C18.0228 16.7862 18.0653 16.6679 18.0825 16.5445C18.0997 16.4212 18.0911 16.2955 18.0574 16.1757C18.0237 16.0559 17.9655 15.9447 17.8867 15.8491C17.8079 15.7536 17.7103 15.6759 17.6 15.6212ZM7.94155 12.2812L9.19357 13.0073C9.33888 13.0776 9.49761 13.1148 9.6586 13.1162C9.82798 13.1138 9.99363 13.0654 10.1383 12.976C10.283 12.8866 10.4015 12.7595 10.4814 12.6079C10.5435 12.4985 10.5835 12.3777 10.5992 12.2524C10.6148 12.1272 10.6057 12 10.5724 11.8784C10.5391 11.7567 10.4823 11.643 10.4052 11.5439C10.3282 11.4447 10.2325 11.3622 10.1236 11.301L8.87162 10.5749C8.76383 10.5118 8.64476 10.4712 8.52134 10.4553C8.39792 10.4395 8.27262 10.4487 8.15275 10.4825C8.03288 10.5163 7.92084 10.574 7.82317 10.6521C7.72549 10.7303 7.64413 10.8275 7.58383 10.9379C7.46399 11.166 7.43428 11.4319 7.50073 11.6814C7.56719 11.9309 7.72481 12.1454 7.94155 12.2812ZM6.40335 9.19531L5.79522 8.83227C5.68714 8.76957 5.56791 8.72915 5.44439 8.71335C5.32087 8.69755 5.19549 8.70667 5.07546 8.7402C4.95542 8.77372 4.8431 8.83098 4.74493 8.90869C4.64676 8.9864 4.56469 9.08303 4.50343 9.19302C4.44217 9.30302 4.40293 9.42421 4.38796 9.54965C4.37299 9.67508 4.38259 9.80228 4.4162 9.92394C4.44981 10.0456 4.50677 10.1593 4.58382 10.2586C4.66087 10.3578 4.75647 10.4406 4.86515 10.5023L5.47328 10.8653C5.61859 10.9357 5.77732 10.9728 5.93831 10.9742C6.10769 10.9718 6.27334 10.9234 6.41804 10.834C6.56273 10.7447 6.68118 10.6176 6.76107 10.466C6.82193 10.3592 6.861 10.2411 6.87592 10.1187C6.89085 9.99635 6.88134 9.87216 6.84796 9.75358C6.81457 9.635 6.758 9.52446 6.68161 9.42854C6.60523 9.33263 6.51059 9.25331 6.40335 9.19531Z' fill='%2320133A'/>
\t\t\t\t\t\t\t<defs>
\t\t\t\t\t\t\t\t<linearGradient id='paint0_linear_714_179' x1='7.13608e-05' y1='14.001' x2='25.1156' y2='14.001' gradientUnits='userSpaceOnUse'>
\t\t\t\t\t\t\t\t\t<stop stop-color='%239059FF'/>
\t\t\t\t\t\t\t\t\t<stop offset='1' stop-color='%23F770FF'/>
\t\t\t\t\t\t\t\t</linearGradient>
\t\t\t\t\t\t\t</defs>
\t\t\t\t\t\t</svg>&quot;); background-repeat: repeat, no-repeat; background-position: 0% 0%, right calc(50% - 0px); background-origin: padding-box, content-box;">
                    <input name="form_key" type="hidden" value="ziYdSbzhPwjSBngC">
                    <button class=""> Send </button>
                </div>
                <div>
                </div>
            </form>
        </div>
    </div>
    <div class="right-column">
        <div class="content">
            <h2 class="" data-content-type="heading" data-appearance="default" data-element="main">Get Lamps Plus Texts</h2>
            <p class="content-text">Be first to know about deals and more</p>
            <div class="input-container">
                <button class="">Sign Up</button>
            </div>
        </div>
    </div>
</div>
</div>
  `;
  const footerHtml = `
       <div class="footer-container container">
        <div class="footer-container-full">
          <div class="footer-left-column-container">
            <div class="sales-rep">
              <div class="flex-1 contact_block_container">
                <div class="footer-contact-links-container">
                  <a class="footer-contact-link" href="sms:000-000-0000">
                    <svg fill="none" height="23" viewBox="0 0 15 25" width="23" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_71_2316)">
                        <path
                          d="M12.5825 0.524841H1.99151C1.05219 0.524841 0.283447 1.31573 0.283447 2.28238V22.3981C0.283447 23.3647 1.05219 24.1556 1.99151 24.1556H12.5825C13.5222 24.1556 14.2906 23.3647 14.2906 22.3981V2.28238C14.2906 1.31573 13.5218 0.524841 12.5825 0.524841ZM7.22646 23.0564C6.6368 23.0564 6.15828 22.5642 6.15828 21.9572C6.15828 21.3502 6.6368 20.858 7.22646 20.858C7.81649 20.858 8.29465 21.3502 8.29465 21.9572C8.29465 22.5646 7.81649 23.0564 7.22646 23.0564ZM12.0331 19.6218H2.55348V3.27266H12.0331V19.6218Z"
                          fill="black"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_71_2316">
                          <rect fill="white" height="24" transform="translate(0.0618896 0.34021)" width="14.4"></rect>
                        </clipPath>
                      </defs>
                    </svg>

                    <span class="footer-contact-link-text">800-782-1967</span>
                  </a>

                  <a class="footer-contact-link" href="mailto:test@mail.com">
                    <svg fill="none" height="23" stroke="currentColor" stroke-width="2"
                         viewBox="0 0 24 24" width="23" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round"
                            stroke-linejoin="round"></path>
                    </svg>
                    <span class="footer-contact-link-text">Email</span>
                  </a>

                  <a class=" footer-contact-link chat-link openChat" href="#">
                    <svg fill="none" height="23" viewBox="0 0 25 24" width="23" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.2825 2.00122H4.28247C3.18247 2.00122 2.28247 2.90122 2.28247 4.00122V22.0012L6.28247 18.0012H20.2825C21.3825 18.0012 22.2825 17.1012 22.2825 16.0012V4.00122C22.2825 2.90122 21.3825 2.00122 20.2825 2.00122ZM20.2825 16.0012H6.28247L4.28247 18.0012V4.00122H20.2825V16.0012Z"
                        fill="black"></path>
                    </svg>
                    <span class="footer-contact-link-text">Start Chat</span>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div class="container social-title">
                <h2 class="hidden">Follow </h2>
              </div>
              <div class="social-links-container">
                <!--Pinterest Logo -->
                <a href="https://www.pinterest.com/lampsplus/" rel="noopener" target="_blank">
                  <svg fill="none" height="24" viewBox="0 0 25 25" width="24" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_71_2309)">
                      <path
                        d="M12.7166 0.689758C6.29163 0.689758 3.052 5.31327 3.052 9.16877C3.052 11.5034 3.93262 13.5803 5.82123 14.3543C6.13102 14.4813 6.40831 14.3587 6.49803 14.0146C6.56043 13.7764 6.70812 13.1757 6.77422 12.9253C6.86468 12.5849 6.8296 12.4656 6.57963 12.1691C6.03502 11.5241 5.68683 10.6896 5.68683 9.50736C5.68683 6.0772 8.24375 3.00631 12.3448 3.00631C15.9766 3.00631 17.9715 5.23351 17.9715 8.20803C17.9715 12.1219 16.2457 15.4247 13.684 15.4247C12.2691 15.4247 11.2105 14.2505 11.5498 12.8101C11.956 11.0906 12.7436 9.23487 12.7436 7.99351C12.7436 6.8825 12.1495 5.95573 10.9199 5.95573C9.47366 5.95573 8.31169 7.45739 8.31169 9.46896C8.31169 10.7502 8.74296 11.6168 8.74296 11.6168C8.74296 11.6168 7.26308 17.9111 7.00351 19.0132C6.48696 21.2083 6.92597 23.8996 6.96289 24.1714C6.98468 24.3323 7.19108 24.3707 7.28412 24.2489C7.41742 24.0743 9.13988 21.9397 9.72585 19.8071C9.89126 19.203 10.677 16.076 10.677 16.076C11.147 16.9754 12.5202 17.7682 13.9805 17.7682C18.3278 17.7682 21.2769 13.7901 21.2769 8.46576C21.278 4.4393 17.8803 0.689758 12.7166 0.689758Z"
                        fill="black"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_71_2309">
                        <rect fill="white" height="24" transform="translate(0.164917 0.505127)" width="24"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <!--Instagram Logo -->
                <a href="https://www.instagram.com/lampsplus/" rel="noopener" target="_blank">
                  <svg fill="none" height="23.63" viewBox="0 0 25 24" width="23.63" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_71_2334)">
                      <path
                        d="M17.8013 0.184631H7.48058C3.81116 0.184631 0.825562 3.16986 0.825562 6.83965V17.1604C0.825562 20.8302 3.81116 23.8154 7.48058 23.8154H17.8009C21.4707 23.8154 24.456 20.8298 24.456 17.1604V6.83965C24.4563 3.16986 21.4711 0.184631 17.8013 0.184631ZM22.4691 17.1604C22.4691 19.7343 20.3752 21.8282 17.8013 21.8282H7.48058C4.90667 21.8282 2.81276 19.7343 2.81276 17.1604V6.83965C2.81276 4.26574 4.90667 2.17183 7.48058 2.17183H17.8009C20.3749 2.17183 22.4688 4.26574 22.4688 6.83965L22.4691 17.1604ZM18.9847 4.19485C18.1945 4.19485 17.5543 4.83509 17.5543 5.62525C17.5543 6.41503 18.1949 7.05565 18.9847 7.05565C19.7745 7.05565 20.4151 6.41503 20.4151 5.62525C20.4151 4.83509 19.7749 4.19485 18.9847 4.19485ZM12.6099 5.99817C9.30901 5.99817 6.62359 8.68359 6.62359 11.9845C6.62359 15.2851 9.30901 17.9705 12.6099 17.9705C15.9109 17.9705 18.5963 15.2851 18.5963 11.9845C18.5959 8.68359 15.9105 5.99817 12.6099 5.99817ZM12.6099 15.9803C10.4067 15.9803 8.61411 14.1877 8.61411 11.9845C8.61411 9.78094 10.4067 7.98832 12.6099 7.98832C14.8135 7.98832 16.6057 9.78094 16.6057 11.9845C16.6057 14.1877 14.8131 15.9803 12.6099 15.9803Z"
                        fill="black"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_71_2334">
                        <rect fill="white" height="24" transform="translate(0.640869)" width="24"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <!--Facebook Logo -->
                <a href="https://www.facebook.com/lampsplus" rel="noopener" target="_blank">
                  <svg fill="none" height="24" viewBox="0 0 14 25" width="12.185" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_71_2314)">
                      <path
                        d="M12.8659 5.23854H10.1067C9.18838 5.23854 8.85977 5.76618 8.85977 6.49171V8.99658H12.8659L12.4059 13.4137H8.85977V24.6505H3.94678V13.4137H1.05054V8.99658H3.94678V6.49171C3.94678 3.52458 4.65977 1.1519 8.85977 1.01971H12.8659V5.23854Z"
                        fill="black"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_71_2314">
                        <rect fill="white" height="24" transform="translate(0.865967 0.835083)" width="12.1846"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <!--Twitter Logo -->
                <a href="https://twitter.com/lampsplus" rel="noopener" target="_blank">
                  <svg fill="none" height="24" viewBox="0 0 25 25" width="23.273" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_71_2286)">
                      <path
                        d="M14.851 10.5613L23.785 0.175293H21.667L13.909 9.19329L7.71302 0.175293H0.567017L9.93702 13.8113L0.567017 24.7033H2.68502L10.877 15.1793L17.421 24.7033H24.567L14.851 10.5613ZM11.951 13.9313L11.001 12.5733L3.44702 1.76929H6.69902L12.795 10.4893L13.745 11.8473L21.669 23.1813H18.417L11.951 13.9313Z"
                        fill="black"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_71_2286">
                        <rect fill="white" height="24.75" transform="translate(0.567017 0.175293)" width="24"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <!--Youtube Logo -->
                <a href="https://www.youtube.com/user/LampsPlus?sub_confirmation=1" rel="noopener" target="_blank">
                  <svg fill="none" height="24" viewBox="0 0 25 25" width="24" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_71_2328)">
                      <path
                        d="M23.8578 7.11056C23.5861 6.08742 22.7852 5.28139 21.7687 5.00779C19.9255 4.5108 12.5361 4.5108 12.5361 4.5108C12.5361 4.5108 5.14667 4.5108 3.30384 5.00779C2.28698 5.28139 1.48649 6.08742 1.21473 7.11056C0.720703 8.9652 0.720703 12.8351 0.720703 12.8351C0.720703 12.8351 0.720703 16.705 1.21436 18.5597C1.48612 19.5828 2.28698 20.3888 3.30347 20.6624C5.1463 21.1594 12.5357 21.1594 12.5357 21.1594C12.5357 21.1594 19.9251 21.1594 21.768 20.6624C22.7848 20.3888 23.5853 19.5832 23.8571 18.5597C24.3515 16.705 24.3515 12.8351 24.3515 12.8351C24.3515 12.8351 24.3515 8.9652 23.8578 7.11056ZM10.1195 16.3487V9.32151L16.2956 12.8351L10.1195 16.3487Z"
                        fill="black"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_71_2328">
                        <rect fill="white" height="24" transform="translate(0.536133 0.835083)" width="24"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <!--TikTok Logo -->
                <a href="https://www.tiktok.com/@lampsplus" rel="noopener" target="_blank">
                  <svg fill="none" height="24" viewBox="0 0 25 25" width="24" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_205_20795)">
                      <path
                        d="M13.3867 0.0302539C14.6967 0.0102539 15.9967 0.0202539 17.2967 0.0102539C17.3767 1.54025 17.9267 3.10025 19.0467 4.18025C20.1667 5.29025 21.7467 5.80025 23.2867 5.97025V10.0003C21.8467 9.95025 20.3967 9.65025 19.0867 9.03025C18.5167 8.77025 17.9867 8.44025 17.4667 8.10025C17.4567 11.0203 17.4767 13.9403 17.4467 16.8503C17.3667 18.2503 16.9067 19.6403 16.0967 20.7903C14.7867 22.7103 12.5167 23.9603 10.1867 24.0003C8.75669 24.0803 7.32669 23.6903 6.10669 22.9703C4.08669 21.7803 2.66669 19.6003 2.45669 17.2603C2.43669 16.7603 2.42669 16.2603 2.44669 15.7703C2.62669 13.8703 3.56669 12.0503 5.02669 10.8103C6.68669 9.37025 9.00669 8.68025 11.1767 9.09025C11.1967 10.5703 11.1367 12.0503 11.1367 13.5303C10.1467 13.2103 8.98669 13.3003 8.11669 13.9003C7.48669 14.3103 7.00669 14.9403 6.75669 15.6503C6.54669 16.1603 6.60669 16.7203 6.61669 17.2603C6.85669 18.9003 8.43669 20.2803 10.1167 20.1303C11.2367 20.1203 12.3067 19.4703 12.8867 18.5203C13.0767 18.1903 13.2867 17.8503 13.2967 17.4603C13.3967 15.6703 13.3567 13.8903 13.3667 12.1003C13.3767 8.07025 13.3567 4.05025 13.3867 0.0302539Z"
                        fill="black"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_205_20795">
                        <rect fill="white" height="24" transform="translate(0.856689 0.0102539)" width="24"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <!--myLampsPlus -->
                <a class="" href="https://www.instagram.com/lampsplus/" rel="noopener" target="_blank">
                  <span class="hashtag-text">#myLampsPlus</span>
                </a>
              </div>
            </div>
          </div>

          <div class="links-footer-container">
            <div class="links-footer-container-full">
${dropdownLinksHTML}
            </div>
          </div>
          <input hidden="" name="am-ccpa-checkboxes-from" value="subscription">
        </div>
      </div>
      <div class="copyright-links-border">
        <div class="copyright-links-container container">
          <div data-appearance="default" data-content-type="html" data-decoded="true" data-element="main">
            <div class="copyright-links">

            </div>
          </div>
                      <p>
            <small class="copyright-text">
              <span>${copyrightParagraph[copyrightParagraph.length - 1].innerHTML}</span>
            </small>
          </p>
          </div>
          </div>
      </div>
      <div class="copyright-message-container container">
        <div data-appearance="default" data-content-type="html" data-decoded="true" data-element="main">
            <span class="copyright-message">
              ${bottomMessageParagraph[bottomMessageParagraph.length - 1].innerHTML}
            </span>
        </div>
      </div>
`;

  // Check for customerType inside localStorage

  const customerType = getCustomerType(true);
  if (customerType !== 'Pro' && customerType !== 'Employee') {
    footer.innerHTML += newsletterSignupHTML;
  }

  footer.innerHTML += footerHtml;
  footer.querySelector('.copyright-links').innerHTML = footerLinksHTML;
  block.append(footer);

  let contentCounter = 1;
  function applyDropdownForMobileAndTablet() {
    if (window.innerWidth <= 900) {
      document.querySelectorAll('.dropdown-header').forEach((header) => {
        const contentId = contentCounter;
        const content = header.parentElement.querySelector('.dropdown-content');
        contentCounter += 1;

        header.setAttribute('aria-controls', `header-${contentId}`);
        header.setAttribute('aria-expanded', 'false');

        content.setAttribute('id', `content-${contentId}`);
        content.setAttribute('aria-labelledby', header.id || `content-${contentId}`);
        content.setAttribute('aria-hidden', 'true');

        header.removeEventListener('click', toggleDropdown);
        header.addEventListener('click', toggleDropdown);
      });
    }
  }

  function toggleDropdown() {
    const header = this;
    const content = header.parentElement.querySelector('.dropdown-content');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    content.classList.toggle('active');
    header.setAttribute('aria-expanded', !isExpanded);
    content.setAttribute('aria-hidden', isExpanded);
  }

  applyDropdownForMobileAndTablet();

  window.addEventListener('resize', applyDropdownForMobileAndTablet);
}
