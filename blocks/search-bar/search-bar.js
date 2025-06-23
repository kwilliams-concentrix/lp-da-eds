export default async function decorate(block) {
  let placeholderText = '';

  const rows = [...block.children];
  rows.forEach((row) => {
    const [key, value] = [...row.children];
    if (key.textContent.trim().toLowerCase() === 'placeholder text') {
      placeholderText = value.textContent.trim();
    }
  });

  const searchbarMarkup = `
    <div id="search-bar" x-data="initMiniSearch()">
        <form id="search_mini_form" x-ref="form" @submit.prevent="search()" action="https://mcstaging2.lampsplus.com/catalogsearch/result/" method="get" role="search">
            <label class="hidden" for="search" data-role="minisearch-label">
                <span>Search</span>
            </label>
            <input id="search" x-ref="searchInput" type="search" autocomplete="off" name="q" value="" placeholder="${placeholderText}" maxlength="128" class="w-full p-2 text-xs leading-normal transition appearance-none text-black ring-0
                    focus:outline-none focus:border-primary focus:ring-0 lg:text-xs border-[1.5px] border-black rounded-md" @focus.once="suggest" @input.debounce.300="suggest" @keydown.arrow-down.prevent="focusElement($root.querySelector('[tabindex]'))" @search-open.window.debounce.10="
                        $el.focus()
                        $el.select()
                ">
            <template x-if="suggestions.length > 0">
                <div class="w-full leading-normal transition appearance-none text-grey-800 flex flex-col suggestions-content absolute">
                    <template x-for="suggestion in suggestions">
                        <div class="flex justify-between p-2 bg-container-lighter even:bg-container mb-1 cursor-pointer
                                    border border-container text-sm hover:bg-container-darker" tabindex="0" @click="search(suggestion.title)" @keydown.enter="search(suggestion.title)" @keydown.arrow-up.prevent="
                                focusElement($event.target.previousElementSibling) || $refs.searchInput.focus()
                            " @keydown.arrow-down.prevent="focusElement($event.target.nextElementSibling)">
                            <span x-text="suggestion.title"></span>
                            <span x-text="suggestion.num_results"></span>
                        </div>
                    </template>
                </div>
            </template>
            <button type="submit" title="Search" class="" aria-label="Search">
                <span class="hidden">Search</span>
                <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_71_2295)">
                    <path d="M18.6398 15.9424L18.0997 16.4811L15.8311 14.1652C16.7265 12.7913 17.2508 11.1449 17.2508 9.37448C17.2508 4.59109 13.4389 0.699768 8.75406 0.699768C4.06926 0.699768 0.257324 4.59109 0.257324 9.37448C0.257324 14.1579 4.06889 18.0492 8.75406 18.0492C10.7442 18.0492 12.573 17.3417 14.0226 16.1672L16.1926 18.3826L15.7787 18.795L21.0266 24.2807L23.8874 21.4276L18.6398 15.9424ZM2.9228 9.37448C2.9228 6.09164 5.53843 3.421 8.75406 3.421C11.9697 3.421 14.5853 6.09128 14.5853 9.37448C14.5853 12.6577 11.9697 15.328 8.75406 15.328C5.53843 15.328 2.9228 12.6573 2.9228 9.37448Z" fill="white"></path>
                    </g>
                    <defs>
                    <clipPath id="clip0_71_2295">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.505127)"></rect>
                    </clipPath>
                    </defs>
                </svg>
            </button>
        </form>
    </div>
 `;

  block.innerHTML = searchbarMarkup;

  const searchInput = block.querySelector('#search');
  if (searchInput) {
    searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}
