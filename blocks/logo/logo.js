export default function decorate(block) {
  // const logoArray = new Array();
  let logoMarkup = '';
  let logo1; let
    logo2;

  const logoWrapper = document.createElement('div');
  logoWrapper.id = 'logo-wrapper';

  [...block.children].forEach((row) => {
    const [key, value] = row.children;

    if (key.textContent.trim().toLowerCase() === 'logo 1') {
      logo1 = value.textContent.trim();
      logoMarkup += `<img class="logo-lampsplus" src="${logo1}" alt="Lamps Plus" height="64" width="200" />`;
    }

    if (key.textContent.trim().toLowerCase() === 'logo 2') {
      logo2 = value.textContent.trim();
      logoMarkup += `<img class="logo-lampsplus-pros" src="${logo2}" alt="Lamps Plus Pros" height="30" width="286" />`;
    }

    // logoArray.push(row.textContent.trim());
  });

  block.innerHTML = '';
  logoWrapper.innerHTML = logoMarkup;
  block.appendChild(logoWrapper);
  block.innerHTML = logoMarkup;
}
