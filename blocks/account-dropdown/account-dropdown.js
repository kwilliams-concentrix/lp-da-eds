export default function decorate(block) {
  let buttonLabel;
  let dropdownOptions = '';

  [...block.children].forEach((row) => {
    // anticipate a key/value pair from the block component
    const key = row.children[0].textContent.trim().toLowerCase();
    const value = row.children[1];

    if (key === 'button label') {
      buttonLabel = value.textContent.trim();
    }

    if (key === 'dropdown options') {
      const linksArray = value.querySelectorAll('a');
      linksArray.forEach((link) => {
        const linkText = link.textContent.trim();
        const linkUrl = link.getAttribute('href');
        const linkTarget = link.getAttribute('target');
        const linkMarkup = `<a href="${linkUrl}" target="${linkTarget}" title="${linkText}">${linkText}</a>`;
        dropdownOptions += linkMarkup;
      });
    }
  });

  // const accountDropdownMarkup = `
  //   <!--Customer Icon & Dropdown-->
  //   <div class="relative" x-data="{ open: false }" @keyup.escape="open = false" @click.outside="open = false">
  //       <button type="button" id="customer-menu" class="block rounded outline-offset-2 flex items-center" @click="open = !open" :aria-expanded="open ? 'true' : 'false'" aria-label="My Account" aria-haspopup="true" aria-expanded="true">
  //           <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  //               <path d="M12.1958 2.09528C6.6758 2.09528 2.1958 6.57528 2.1958 12.0953C2.1958 17.6153 6.6758 22.0953 12.1958 22.0953C17.7158 22.0953 22.1958 17.6153 22.1958 12.0953C22.1958 6.57528 17.7158 2.09528 12.1958 2.09528ZM7.5458 18.5953C8.8558 17.6553 10.4558 17.0953 12.1958 17.0953C13.9358 17.0953 15.5358 17.6553 16.8458 18.5953C15.5358 19.5353 13.9358 20.0953 12.1958 20.0953C10.4558 20.0953 8.8558 19.5353 7.5458 18.5953ZM18.3358 17.2153C16.6458 15.8953 14.5158 15.0953 12.1958 15.0953C9.8758 15.0953 7.7458 15.8953 6.0558 17.2153C4.8958 15.8253 4.1958 14.0453 4.1958 12.0953C4.1958 7.67528 7.7758 4.09528 12.1958 4.09528C16.6158 4.09528 20.1958 7.67528 20.1958 12.0953C20.1958 14.0453 19.4958 15.8253 18.3358 17.2153Z" fill="black"></path>
  //               <path d="M12.1958 6.09528C10.2658 6.09528 8.6958 7.66528 8.6958 9.59528C8.6958 11.5253 10.2658 13.0953 12.1958 13.0953C14.1258 13.0953 15.6958 11.5253 15.6958 9.59528C15.6958 7.66528 14.1258 6.09528 12.1958 6.09528ZM12.1958 11.0953C11.3658 11.0953 10.6958 10.4253 10.6958 9.59528C10.6958 8.76528 11.3658 8.09528 12.1958 8.09528C13.0258 8.09528 13.6958 8.76528 13.6958 9.59528C13.6958 10.4253 13.0258 11.0953 12.1958 11.0953Z" fill="black"></path>
  //           </svg>
  //           <span class="txt-ico ml-2 items-center hidden md:flex">
  //               ${buttonLabel} (Sign In)
  //               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="17" height="17" fill="currentColor" aria-hidden="true" class="ml-1">
  //                   <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
  //               </svg>
  //           </span>
  //       </button>
  //       <nav class="absolute right-0 z-20 w-40 py-2 mt-2 -mr-4 px-1 overflow-auto origin-top-right rounded-sm shadow-lg sm:w-48 lg:mt-3 bg-container-lighter" x-show="open" aria-labelledby="customer-menu">            
  //           ${dropdownOptions}    
  //           <a id="customer.header.sign.in.link" class="block px-4 py-2 lg:px-5 lg:py-2 hover:bg-gray-100" onclick="hyva.setCookie &amp;&amp; hyva.setCookie('login_redirect', window.location.href, 1)" href="https://mcstaging2.lampsplus.com/customer/account/index/" title="Sign In">Sign In</a>
  //           <a id="customer.header.register.link" class="block px-4 py-2 lg:px-5 lg:py-2 hover:bg-gray-100" href="https://mcstaging2.lampsplus.com/customer/account/create/" title="Create an Account">
  //           Create an Account</a>
  //           <a class="block px-4 py-2 lg:px-5 lg:py-2 hover:bg-gray-100" href="https://mcstaging2.lampsplus.com/company/account/create/">Create New Company Account</a>
  //           <a id="customer.header.saved.link" class="flex items-center px-4 py-2 lg:px-5 lg:py-2 hover:bg-gray-100" href="https://mcstaging2.lampsplus.com/guest-wishlist/index/" title="Saved">
  //               <!-- Plain Heart Outline SVG Icon -->
  //               <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
  //                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09
  //               3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
  //               </svg>Saved
  //           </a>
  //       </nav>
  //   </div>`;

  const accountDropdownButton = document.createElement('button');
  accountDropdownButton.setAttribute('id', 'account-dropdown-button');
  accountDropdownButton.setAttribute('aria-label', 'My Account');
  accountDropdownButton.setAttribute('aria-haspopup', 'true');
  accountDropdownButton.setAttribute('aria-expanded', 'true');
  accountDropdownButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1958 2.09528C6.6758 2.09528 2.1958 6.57528 2.1958 12.0953C2.1958 17.6153 6.6758 22.0953 12.1958 22.0953C17.7158 22.0953 22.1958 17.6153 22.1958 12.0953C22.1958 6.57528 17.7158 2.09528 12.1958 2.09528ZM7.5458 18.5953C8.8558 17.6553 10.4558 17.0953 12.1958 17.0953C13.9358 17.0953 15.5358 17.6553 16.8458 18.5953C15.5358 19.5353 13.9358 20.0953 12.1958 20.0953C10.4558 20.0953 8.8558 19.5353 7.5458 18.5953ZM18.3358 17.2153C16.6458 15.8953 14.5158 15.0953 12.1958 15.0953C9.8758 15.0953 7.7458 15.8953 6.0558 17.2153C4.8958 15.8253 4.1958 14.0453 4.1958 12.0953C4.1958 7.67528 7.7758 4.09528 12.1958 4.09528C16.6158 4.09528 20.1958 7.67528 20.1958 12.0953C20.1958 14.0453 19.4958 15.8253 18.3358 17.2153Z" fill="black"></path>
        <path d="M12.1958 6.09528C10.2658 6.09528 8.6958 7.66528 8.6958 9.59528C8.6958 11.5253 10.2658 13.0953 12.1958 13.0953C14.1258 13.0953 15.6958 11.5253 15.6958 9.59528C15.6958 7.66528 14.1258 6.09528 12.1958 6.09528ZM12.1958 11.0953C11.3658 11.0953 10.6958 10.4253 10.6958 9.59528C10.6958 8.76528 11.3658 8.09528 12.1958 8.09528C13.0258 8.09528 13.6958 8.76528 13.6958 9.59528C13.6958 10.4253 13.0258 11.0953 12.1958 11.0953Z" fill="black"></path>
    </svg>
    <span class="txt-ico ml-2 items-center hidden md:flex">
        ${buttonLabel} (Sign In)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="17" height="17" fill="currentColor" aria-hidden="true" class="ml-1">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
    </span>`;
  accountDropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    block.querySelector('nav').classList.toggle('show');
  });

  const accountDropdownNav = document.createElement('nav');
  accountDropdownNav.id = 'account-dropdown-nav';
  accountDropdownNav.innerHTML = `${dropdownOptions}`;

  block.id = 'account-dropdown';
  block.innerHTML = '<!--Customer Icon & Dropdown-->';
  block.append(accountDropdownButton);
  block.append(accountDropdownNav);

  // block.innerHTML = accountDropdownMarkup;
}
